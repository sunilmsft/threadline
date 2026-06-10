// Threadline — Main Application
(async function() {
    'use strict';

    // State
    let projects = [];
    let sources = {};
    let currentView = 'stage';
    let searchQuery = '';
    let showHidden = false;

    // DOM refs
    const board = document.getElementById('board');
    const searchInput = document.getElementById('search');
    const newIdeaBtn = document.getElementById('new-idea-btn');
    const modal = document.getElementById('new-idea-modal');
    const ideaForm = document.getElementById('idea-form');
    const cancelBtn = document.getElementById('cancel-idea');
    const viewBtns = document.querySelectorAll('.view-btn');

    // Load projects
    async function loadProjects() {
        try {
            const res = await fetch('data/projects.json');
            const data = await res.json();
            projects = data.projects;
            sources = data.sources || {};
            // Merge any localStorage ideas
            const localIdeas = JSON.parse(localStorage.getItem('threadline-ideas') || '[]');
            projects = [...projects, ...localIdeas];
        } catch (e) {
            console.error('Failed to load projects:', e);
            projects = JSON.parse(localStorage.getItem('threadline-ideas') || '[]');
        }
        render();
        fetchLastUpdated();
    }

    // Fetch last updated dates from GitHub API
    async function fetchLastUpdated() {
        if (!sources.github) return;
        try {
            const res = await fetch(`https://api.github.com/users/${sources.github}/repos?per_page=100&sort=updated`);
            if (!res.ok) return;
            const repos = await res.json();
            const repoMap = {};
            repos.forEach(r => { repoMap[r.full_name.toLowerCase()] = r.pushed_at || r.updated_at; });

            let updated = false;
            projects.forEach(p => {
                if (p.repo && repoMap[p.repo.toLowerCase()]) {
                    p.lastUpdated = repoMap[p.repo.toLowerCase()];
                    updated = true;
                }
            });
            if (updated) render();
        } catch (e) {
            console.log('Failed to fetch last updated:', e.message);
        }
    }

    // Format relative time
    function timeAgo(dateStr) {
        if (!dateStr) return '';
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'today';
        if (diffDays === 1) return 'yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
        return `${Math.floor(diffDays / 365)}y ago`;
    }

    // Render based on current view
    function render() {
        const hiddenIds = JSON.parse(localStorage.getItem('threadline-hidden') || '[]');
        const filtered = projects.filter(p => {
            if (showHidden) {
                // Only show hidden projects
                return hiddenIds.includes(p.id);
            }
            // Normal mode: hide hidden projects
            if (hiddenIds.includes(p.id)) return false;
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return p.name.toLowerCase().includes(q) ||
                   p.tagline.toLowerCase().includes(q) ||
                   (p.tech || []).some(t => t.toLowerCase().includes(q)) ||
                   (p.tags || []).some(t => t.toLowerCase().includes(q)) ||
                   (p.category || '').toLowerCase().includes(q);
        });

        switch (currentView) {
            case 'stage': renderByStage(filtered); break;
            case 'category': renderByCategory(filtered); break;
            case 'recent': renderByRecent(filtered); break;
            case 'pinned': renderPinned(filtered); break;
        }
    }

    function renderByStage(items) {
        const collapsed = JSON.parse(localStorage.getItem('threadline-collapsed') || '[]');
        const stages = ['idea', 'validated', 'building', 'live', 'archived'];
        board.innerHTML = stages.map(stage => {
            const stageItems = items.filter(p => p.stage === stage);
            if (stageItems.length === 0 && stage === 'archived' && !searchQuery) {
                return ''; // Hide empty archived unless searching
            }
            const isCollapsed = collapsed.includes('stage-' + stage);
            return `
                <section class="stage-group ${isCollapsed ? 'collapsed' : ''}">
                    <div class="stage-header" data-collapse-id="stage-${stage}">
                        <span class="collapse-icon">${isCollapsed ? '▶' : '▼'}</span>
                        <span class="stage-dot ${stage}"></span>
                        <h2>${stage}</h2>
                        <span class="stage-count">${stageItems.length}</span>
                    </div>
                    <div class="cards-grid">
                        ${stageItems.map(renderCard).join('')}
                    </div>
                </section>
            `;
        }).join('');
    }

    function renderByCategory(items) {
        const collapsed = JSON.parse(localStorage.getItem('threadline-collapsed') || '[]');
        const categories = [...new Set(items.map(p => p.category))].sort();
        board.innerHTML = categories.map(cat => {
            const catItems = items.filter(p => p.category === cat);
            const isCollapsed = collapsed.includes('cat-' + cat);
            return `
                <section class="stage-group ${isCollapsed ? 'collapsed' : ''}">
                    <div class="stage-header" data-collapse-id="cat-${cat}">
                        <span class="collapse-icon">${isCollapsed ? '▶' : '▼'}</span>
                        <h2>${formatCategory(cat)}</h2>
                        <span class="stage-count">${catItems.length}</span>
                    </div>
                    <div class="cards-grid">
                        ${catItems.map(renderCard).join('')}
                    </div>
                </section>
            `;
        }).join('');
    }

    function renderByRecent(items) {
        // Sort by createdAt descending (will improve with GitHub API later)
        const sorted = [...items].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );
        board.innerHTML = `
            <section class="stage-group">
                <div class="stage-header">
                    <h2>All Projects</h2>
                    <span class="stage-count">${sorted.length}</span>
                </div>
                <div class="cards-grid">
                    ${sorted.map(renderCard).join('')}
                </div>
            </section>
        `;
    }

    function renderPinned(items) {
        const pinned = items.filter(p => p.pinned);
        if (pinned.length === 0) {
            board.innerHTML = `
                <div class="empty-state">
                    <p>No pinned projects yet.</p>
                    <p>Click a project card and pin it to keep it top of mind.</p>
                </div>
            `;
            return;
        }
        board.innerHTML = `
            <section class="stage-group">
                <div class="stage-header">
                    <h2>Pinned</h2>
                    <span class="stage-count">${pinned.length}</span>
                </div>
                <div class="cards-grid">
                    ${pinned.map(renderCard).join('')}
                </div>
            </section>
        `;
    }

    function renderCard(project) {
        const hiddenIds = JSON.parse(localStorage.getItem('threadline-hidden') || '[]');
        const isHidden = hiddenIds.includes(project.id);
        const blockerHtml = project.blockers && project.blockers.length > 0
            ? `<div class="card-blockers">⚠️ ${project.blockers[0]}</div>`
            : '';
        
        const techHtml = (project.tech || []).slice(0, 4).map(t => 
            `<span class="tech-tag">${t}</span>`
        ).join('');

        const tagsHtml = (project.tags || []).map(t => 
            `<span class="project-tag">${t}</span>`
        ).join('');

        return `
            <div class="project-card ${project.pinned ? 'pinned' : ''} ${isHidden ? 'is-hidden' : ''}" data-id="${project.id}">
                <div class="card-header">
                    <span class="card-name">${project.name}</span>
                    <div class="card-actions">
                        <button class="card-pin-btn" data-id="${project.id}" title="${project.pinned ? 'Unpin' : 'Pin'}">${project.pinned ? 'unpin' : 'pin'}</button>
                        <button class="card-hide-btn" data-id="${project.id}" title="${isHidden ? 'Unhide' : 'Hide'}">${isHidden ? 'show' : 'hide'}</button>
                    </div>
                </div>
                <p class="card-tagline">${project.tagline}</p>
                <div class="card-tech">${techHtml}</div>
                ${tagsHtml ? `<div class="card-tags">${tagsHtml}</div>` : ''}
                ${blockerHtml}
                <div class="card-footer">
                    <span>${project.category || ''}</span>
                    ${project.lastUpdated || project.createdAt ? `<span class="card-updated">${timeAgo(project.lastUpdated || project.createdAt)}</span>` : ''}
                    <span>${project.stage}</span>
                </div>
            </div>
        `;
    }

    function formatCategory(cat) {
        return cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }

    // Event: View switching
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            render();
        });
    });

    // Event: Collapse/expand sections
    board.addEventListener('click', (e) => {
        const header = e.target.closest('.stage-header[data-collapse-id]');
        if (header && !e.target.closest('.card-hide-btn') && !e.target.closest('.card-pin-btn')) {
            const id = header.dataset.collapseId;
            const collapsed = JSON.parse(localStorage.getItem('threadline-collapsed') || '[]');
            const idx = collapsed.indexOf(id);
            if (idx === -1) {
                collapsed.push(id);
            } else {
                collapsed.splice(idx, 1);
            }
            localStorage.setItem('threadline-collapsed', JSON.stringify(collapsed));
            render();
            return;
        }

        // Handle hide button
        if (e.target.classList.contains('card-hide-btn')) {
            e.stopPropagation();
            const id = e.target.dataset.id;
            const hiddenIds = JSON.parse(localStorage.getItem('threadline-hidden') || '[]');
            const idx = hiddenIds.indexOf(id);
            if (idx === -1) {
                hiddenIds.push(id);
            } else {
                hiddenIds.splice(idx, 1);
            }
            localStorage.setItem('threadline-hidden', JSON.stringify(hiddenIds));
            render();
            return;
        }

        // Handle pin button
        if (e.target.classList.contains('card-pin-btn')) {
            e.stopPropagation();
            const id = e.target.dataset.id;
            const project = projects.find(p => p.id === id);
            if (project) {
                project.pinned = !project.pinned;
                const pinState = JSON.parse(localStorage.getItem('threadline-pins') || '{}');
                pinState[id] = project.pinned;
                localStorage.setItem('threadline-pins', JSON.stringify(pinState));
                render();
            }
            return;
        }
    });

    // Event: Search
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        render();
    });

    // Event: Show hidden toggle
    document.getElementById('show-hidden').addEventListener('change', (e) => {
        showHidden = e.target.checked;
        render();
    });

    // Event: New Idea modal
    newIdeaBtn.addEventListener('click', () => modal.showModal());
    cancelBtn.addEventListener('click', () => modal.close());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.close();
    });

    // Event: Save new idea
    ideaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(ideaForm);
        const newIdea = {
            id: 'idea-' + Date.now(),
            name: formData.get('name'),
            tagline: formData.get('tagline') || '',
            category: formData.get('category'),
            stage: 'idea',
            tech: [],
            repo: null,
            url: null,
            createdAt: new Date().toISOString().split('T')[0],
            pinned: true, // New ideas are pinned by default
            blockers: [],
            notes: formData.get('notes') || ''
        };

        // Save to localStorage
        const localIdeas = JSON.parse(localStorage.getItem('threadline-ideas') || '[]');
        localIdeas.push(newIdea);
        localStorage.setItem('threadline-ideas', JSON.stringify(localIdeas));

        // Add to current session
        projects.push(newIdea);
        
        ideaForm.reset();
        modal.close();
        render();
    });

    // Restore pin state from localStorage
    function restorePinState() {
        const pinState = JSON.parse(localStorage.getItem('threadline-pins') || '{}');
        projects.forEach(p => {
            if (pinState[p.id] !== undefined) {
                p.pinned = pinState[p.id];
            }
        });
    }

    // Discovery: scan GitHub for repos not in projects list
    async function discoverNewRepos() {
        if (!sources.github) return;
        const excluded = sources.exclude || [];
        const dismissed = JSON.parse(localStorage.getItem('threadline-dismissed') || '[]');

        try {
            const res = await fetch(`https://api.github.com/users/${sources.github}/repos?per_page=100&sort=updated`);
            if (!res.ok) return;
            const repos = await res.json();

            const trackedRepos = projects
                .filter(p => p.repo)
                .map(p => p.repo.split('/')[1].toLowerCase());

            const trackedIds = projects.map(p => p.id.toLowerCase());

            const untracked = repos.filter(repo => {
                const name = repo.name.toLowerCase();
                return !trackedRepos.includes(name) &&
                       !trackedIds.includes(name) &&
                       !excluded.includes(repo.name) &&
                       !dismissed.includes(repo.name) &&
                       !repo.archived;
            });

            if (untracked.length > 0) {
                showDiscoveryBanner(untracked);
            }
        } catch (e) {
            console.log('Discovery scan skipped:', e.message);
        }
    }

    function showDiscoveryBanner(repos) {
        const existing = document.getElementById('discovery-banner');
        if (existing) existing.remove();

        const banner = document.createElement('div');
        banner.id = 'discovery-banner';
        banner.className = 'discovery-banner';
        banner.innerHTML = `
            <div class="discovery-header">
                <span>🔍 Found ${repos.length} repo${repos.length > 1 ? 's' : ''} on GitHub not tracked in Threadline</span>
                <button class="btn btn-secondary discovery-dismiss-all">Dismiss All</button>
            </div>
            <div class="discovery-list">
                ${repos.map(r => `
                    <div class="discovery-item" data-repo="${r.name}">
                        <div class="discovery-info">
                            <strong>${r.name}</strong>
                            <span class="discovery-desc">${r.description || 'No description'}</span>
                            <span class="discovery-date">Updated ${new Date(r.updated_at).toLocaleDateString()}</span>
                        </div>
                        <div class="discovery-actions">
                            <button class="btn btn-primary discovery-add" data-repo='${JSON.stringify({name: r.name, description: r.description || '', full_name: r.full_name})}'>+ Add</button>
                            <button class="btn btn-secondary discovery-skip" data-repo="${r.name}">Skip</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        document.querySelector('.board').before(banner);

        // Event: Add repo
        banner.addEventListener('click', (e) => {
            if (e.target.classList.contains('discovery-add')) {
                const repoData = JSON.parse(e.target.dataset.repo);
                addDiscoveredProject(repoData);
                e.target.closest('.discovery-item').remove();
                checkBannerEmpty(banner);
            }
            if (e.target.classList.contains('discovery-skip')) {
                const name = e.target.dataset.repo;
                dismissRepo(name);
                e.target.closest('.discovery-item').remove();
                checkBannerEmpty(banner);
            }
            if (e.target.classList.contains('discovery-dismiss-all')) {
                const allRepos = banner.querySelectorAll('.discovery-item');
                allRepos.forEach(item => dismissRepo(item.dataset.repo));
                banner.remove();
            }
        });
    }

    function checkBannerEmpty(banner) {
        if (banner.querySelectorAll('.discovery-item').length === 0) {
            banner.remove();
        }
    }

    function dismissRepo(name) {
        const dismissed = JSON.parse(localStorage.getItem('threadline-dismissed') || '[]');
        if (!dismissed.includes(name)) {
            dismissed.push(name);
            localStorage.setItem('threadline-dismissed', JSON.stringify(dismissed));
        }
    }

    function addDiscoveredProject(repoData) {
        const newProject = {
            id: repoData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            name: repoData.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            tagline: repoData.description || '',
            stage: 'idea',
            category: 'personal-tools',
            repo: repoData.full_name,
            localPath: null,
            tech: [],
            url: null,
            createdAt: new Date().toISOString().split('T')[0],
            pinned: false,
            tags: [],
            blockers: [],
            notes: 'Auto-discovered from GitHub.'
        };

        // Save to localStorage (will be merged into projects.json manually or via future sync)
        const localIdeas = JSON.parse(localStorage.getItem('threadline-ideas') || '[]');
        localIdeas.push(newProject);
        localStorage.setItem('threadline-ideas', JSON.stringify(localIdeas));

        projects.push(newProject);
        render();
    }

    // Init
    await loadProjects();
    restorePinState();
    render();
    discoverNewRepos();
})();
