import { Actor } from 'apify';

await Actor.init();

const input = (await Actor.getInput()) || {};
const targets = Array.isArray(input.targets) && input.targets.length > 0
    ? input.targets
    : ['sindresorhus', 'shadcn'];

async function ghGet(path) {
    const res = await fetch(`https://api.github.com${path}`, {
        headers: {
            'Accept': 'application/vnd.github+json',
            'User-Agent': 'Apify-GitHub-Talent-Enricher/1.0'
        }
    });
    if (!res.ok) return null;
    return await res.json();
}

for (const rawTarget of targets) {
    const username = String(rawTarget).replace(/^https?:\/\/github\.com\//i, '').split('/')[0].trim();
    if (!username) continue;

    const user = await ghGet(`/users/${encodeURIComponent(username)}`);
    if (!user || !user.login) {
        await Actor.pushData({ username, status: 'NOT_FOUND', scrapedAt: new Date().toISOString() });
        continue;
    }

    const repos = (await ghGet(`/users/${encodeURIComponent(username)}/repos?per_page=30&sort=updated`)) || [];
    const events = (await ghGet(`/users/${encodeURIComponent(username)}/events/public?per_page=30`)) || [];

    const commitEmails = new Set();
    if (user.email) commitEmails.add(user.email);
    if (Array.isArray(events)) {
        for (const ev of events) {
            for (const c of (ev.payload?.commits || [])) {
                const em = c.author?.email;
                if (em && !em.includes('noreply.github.com')) commitEmails.add(em);
            }
        }
    }

    const langCounts = {};
    let totalStars = 0;
    let totalForks = 0;
    for (const r of (Array.isArray(repos) ? repos : [])) {
        totalStars += Number(r.stargazers_count || 0);
        totalForks += Number(r.forks_count || 0);
        if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1;
    }
    const topLanguages = Object.entries(langCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([lang]) => lang);

    const talentScore = Math.min(
        100,
        (user.followers >= 100 ? 30 : Math.floor((user.followers || 0) * 0.3)) +
        (totalStars >= 200 ? 30 : Math.floor(totalStars * 0.15)) +
        (commitEmails.size > 0 ? 20 : 0) +
        (topLanguages.length > 0 ? 20 : 0)
    );

    await Actor.pushData({
        username: user.login || username,
        profileUrl: user.html_url || `https://github.com/${username}`,
        fullName: user.name || user.login || username,
        bio: user.bio || '',
        company: user.company || '',
        location: user.location || '',
        emails: Array.from(commitEmails),
        blogOrWebsite: user.blog || '',
        twitterUsername: user.twitter_username || '',
        hireable: Boolean(user.hireable),
        followers: Number(user.followers || 0),
        publicRepos: Number(user.public_repos || 0),
        totalRecentStars: Number(totalStars || 0),
        totalRecentForks: Number(totalForks || 0),
        topLanguages,
        talentScore: Number(talentScore || 0),
        topRepositories: (Array.isArray(repos) ? repos : []).slice(0, 8).map((r) => ({
            name: r.name,
            url: r.html_url,
            stars: r.stargazers_count,
            language: r.language,
            description: r.description
        })),
        scrapedAt: new Date().toISOString()
    });
}

await Actor.exit();
