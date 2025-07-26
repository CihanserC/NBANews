    let injuryData = [];
    let transferData = [];
    let refreshInterval;
    let nextRefreshTime;

    const API_CONFIG = {
        injuries: {
            url: 'http://localhost:8080/api/injuries',
            headers: {}
        },
        transfers: {
            url: 'http://localhost:8080/api/transfers',
            headers: {}
        }
    };

    function createParticles() {
        const container = document.querySelector('.floating-particles');
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.width = Math.random() * 4 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDelay = Math.random() * 6 + 's';
            container.appendChild(particle);
        }
    }

    createParticles();

async function fetchData(config, type) {
const contentElement = document.getElementById(`${type}Content`);

contentElement.innerHTML = `
    <div class="loading">
        <div class="spinner"></div>
        <p>Loading ${type} data...</p>
    </div>
`;

try {
    console.log(`Fetching ${type} data from: ${config.url}`);

    const response = await fetch(config.url, {
        method: 'GET',
        headers: config.headers,
        credentials: 'same-origin'
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`${type} data received:`, data);

    if (type === 'injury') {
        if (data.daily_injuries) {
            injuryData = data.daily_injuries;
        } else if (data.injuries) {
            injuryData = data.injuries;
        } else if (Array.isArray(data)) {
            injuryData = data;
        } else if (data.teams) {
            injuryData = [];
            data.teams.forEach(team => {
                if (team.players && Array.isArray(team.players)) {
                    team.players.forEach(player => {
                        if (player.injuries && player.injuries.length > 0) {
                            player.injuries.forEach(injury => {
                                injuryData.push({
                                    player_name: player.full_name,
                                    team_name: `${team.market} ${team.name}`,
                                    injury: injury.desc,
                                    status: injury.status,
                                    date: injury.update_date,
                                    comment: injury.comment
                                });
                            });
                        }
                    });
                }
            });
        } else {
            injuryData = [];
            console.warn('Unexpected injury data format:', data);
        }
        renderInjuries();
    } else {
if (data.transfers) {
    transferData = data.transfers;
} else if (data.daily_transfers) {
    transferData = data.daily_transfers;
} else if (Array.isArray(data)) {
    transferData = data;
} else if (data.players) {
    transferData = [];
    data.players.forEach(player => {
        if (player.transfers && Array.isArray(player.transfers)) {
            player.transfers.forEach(transfer => {
                const transferItem = {
                    player_name: player.full_name,
                    type: transfer.transaction_type || transfer.desc,
                    date: transfer.effective_date || transfer.last_modified?.split('T')[0],
                    details: transfer.desc
                };

                if (transfer.from_team) {
                    transferItem.from_team = `${transfer.from_team.market || ''} ${transfer.from_team.name || ''}`.trim();
                } else {
                    transferItem.from_team = "N/A";
                }

                if (transfer.to_team) {
                    transferItem.to_team = `${transfer.to_team.market || ''} ${transfer.to_team.name || ''}`.trim();
                } else {
                    transferItem.to_team = "N/A";
                }

                transferData.push(transferItem);
            });
        }
    });
} else {
    transferData = [];
    console.warn('Unexpected transfer data format:', data);
}
renderTransfers();
    }

    updateStats();

} catch (error) {
    console.error(`Error fetching ${type} data:`, error);
    contentElement.innerHTML = `
        <div class="error">
            <strong>Error loading ${type} data:</strong><br>
            ${error.message}<br>
            <small>Check browser or verify the API key</small>
        </div>
    `;


    updateStats();
}
}

    function renderInjuries() {
        const container = document.getElementById('injuryContent');

        if (!injuryData || injuryData.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">✅</div>
                    <p>No injuries reported today</p>
                    <small>All players are healthy!</small>
                </div>
            `;
            return;
        }

const itemsHtml = injuryData.map(injury => `
    <div class="item-card">
        <div class="item-header">
            <div>
                <div class="player-name">${injury.player_name || injury.name || injury.full_name || 'Unknown Player'}</div>
                <div class="team-name">${injury.team_name || injury.team || injury.team_alias || 'Unknown Team'}</div>
            </div>
            <span class="status-badge status-injury">Injured</span>
        </div>
        <div class="item-details">
            <strong>Injury:</strong> ${injury.injury || injury.description || injury.injury_type || injury.desc || 'Not specified'}<br>
            <strong>Status:</strong> ${injury.status || injury.injury_status || injury.playing_status || 'Unknown'}<br>
            ${injury.expected_return || injury.return_date ? `<strong>Expected Return:</strong> ${injury.expected_return || injury.return_date}<br>` : ''}
            ${injury.comment ? `<strong>Comment:</strong> ${injury.comment}<br>` : ''}
            ${injury.details || injury.update ? `<strong>Details:</strong> ${injury.details || injury.update}` : ''}
        </div>
        <div class="item-meta">
            <span class="date-tag">${injury.date || injury.injury_date || injury.updated || injury.update_date || new Date().toLocaleDateString()}</span>
            <!-- Severity kısmını kaldırdık -->
        </div>
    </div>
`).join('');

        container.innerHTML = `<div class="item-list">${itemsHtml}</div>`;
    }

    function renderTransfers() {
        const container = document.getElementById('transferContent');

        if (!transferData || transferData.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <p>No transfers reported recently</p>
                    <small>No player movements</small>
                </div>
            `;
            return;
        }

        const itemsHtml = transferData.map(transfer => `
            <div class="item-card">
                <div class="item-header">
                    <div>
                        <div class="player-name">${transfer.player_name || transfer.name || transfer.full_name || 'Unknown Player'}</div>
                        <div class="team-name">${transfer.from_team || transfer.previous_team || transfer.old_team || 'Unknown'} → ${transfer.to_team || transfer.new_team || transfer.current_team || 'Unknown'}</div>
                    </div>
                    <span class="status-badge status-transfer">Transfer</span>
                </div>
                <div class="item-details">
                    <strong>Type:</strong> ${transfer.type || transfer.transfer_type || transfer.transaction_type || 'Not specified'}<br>
                    <strong>Status:</strong> ${transfer.status || transfer.transaction_status || 'Completed'}<br>
                    ${transfer.contract_details || transfer.contract ? `<strong>Contract:</strong> ${transfer.contract_details || transfer.contract}<br>` : ''}
                    ${transfer.fee || transfer.compensation ? `<strong>Compensation:</strong> ${transfer.fee || transfer.compensation}<br>` : ''}
                    ${transfer.details || transfer.description ? `<strong>Details:</strong> ${transfer.details || transfer.description}` : ''}
                </div>
                <div class="item-meta">
                    <span class="date-tag">${transfer.date || transfer.transfer_date || transfer.transaction_date || new Date().toLocaleDateString()}</span>
                    <span>${transfer.source || 'Official'}</span>
                </div>
            </div>
        `).join('');

        container.innerHTML = `<div class="item-list">${itemsHtml}</div>`;
    }

    function updateStats() {
        const injuryCount = injuryData.length;
        const transferCount = transferData.length;

        document.getElementById('injuryCount').textContent = `${injuryCount} Injuries`;
        document.getElementById('transferCount').textContent = `${transferCount} Transfers`;
        document.getElementById('injurySectionCount').textContent = injuryCount;
        document.getElementById('transferSectionCount').textContent = transferCount;
        document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();
    }

    function updateNextRefreshTime() {
        if (nextRefreshTime) {
            const now = new Date();
            const timeUntilRefresh = nextRefreshTime - now;

            if (timeUntilRefresh > 0) {
                const minutes = Math.floor(timeUntilRefresh / (1000 * 60));
                const hours = Math.floor(minutes / 60);
                const remainingMinutes = minutes % 60;

                let timeString = '';
                if (hours > 0) {
                    timeString = `${hours}h ${remainingMinutes}m`;
                } else {
                    timeString = `${remainingMinutes}m`;
                }

                document.getElementById('nextRefresh').textContent = `Next: ${timeString}`;
            } else {
                document.getElementById('nextRefresh').textContent = 'Next: Now';
            }
        }
    }

    async function fetchAllData() {
        console.log('Fetching NBA data...');

        nextRefreshTime = new Date(Date.now() + 60 * 60 * 1000);

        await Promise.all([
            fetchData(API_CONFIG.injuries, 'injury'),
            fetchData(API_CONFIG.transfers, 'transfer')
        ]);

        console.log('Data fetch completed');
    }

    function clearData() {
        injuryData = [];
        transferData = [];

        document.getElementById('injuryContent').innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🏥</div>
                <p>No injury data loaded</p>
                <small>Click refresh to load data</small>
            </div>
        `;

        document.getElementById('transferContent').innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔄</div>
                <p>No transfer data loaded</p>
                <small>Click refresh to load data</small>
            </div>
        `;

        updateStats();
    }

    function startAutoRefresh() {
        if (refreshInterval) {
            clearInterval(refreshInterval);
        }

        refreshInterval = setInterval(fetchAllData, 3600000);

        setInterval(updateNextRefreshTime, 60000);
    }

    window.addEventListener('load', () => {
        console.log('NBA Dashboard initialized');
        fetchAllData();
        startAutoRefresh();
    });