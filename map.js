// USA Map Implementation
class USAMap {
    constructor() {
        this.mapContainer = document.getElementById('usa-map');
        this.currentHighlightedState = null;
        this.createMap();
    }

    createMap() {
        // Create accurate SVG map of the USA using proper SVG content
        this.loadUSAMapSVG();
    }

    async loadUSAMapSVG() {
        try {
            // Load the SVG content from the us-map.svg file
            const response = await fetch('us-map.svg');
            const svgContent = await response.text();

            // Parse the SVG content
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
            const svgElement = svgDoc.querySelector('svg');

            if (svgElement) {
                // Set proper viewBox and dimensions
                svgElement.setAttribute('viewBox', '0 0 1000 589');
                svgElement.setAttribute('width', '100%');
                svgElement.setAttribute('height', 'auto');
                svgElement.setAttribute('style', 'stroke-linejoin: round; stroke:#ccc; fill: #f9f9f9;');

                // Find all state paths and update their attributes
                const statePaths = svgElement.querySelectorAll('path[id]');
                statePaths.forEach(path => {
                    const stateCode = path.getAttribute('id');
                    const stateName = path.getAttribute('data-name');

                    if (stateCode && stateName) {
                        // Convert state code to lowercase with dashes
                        const stateId = this.convertStateCodeToId(stateCode);

                        // Update attributes for our quiz application
                        path.setAttribute('id', `state-${stateId}`);
                        path.setAttribute('class', 'usa-map-state');
                        path.setAttribute('data-state-id', stateId);
                        path.setAttribute('data-state-name', stateName);

                        // Remove any existing style and set our default
                        path.removeAttribute('style');

                        // Add title for accessibility
                        let title = path.querySelector('title');
                        if (!title) {
                            title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
                            path.appendChild(title);
                        }
                        title.textContent = stateName;
                    }
                });

                // Add title to the map
                const mapTitle = document.createElement('div');
                mapTitle.className = 'map-title';
                mapTitle.textContent = 'United States Map';
                mapTitle.style.textAlign = 'center';
                mapTitle.style.marginBottom = '1rem';
                mapTitle.style.fontWeight = 'bold';
                mapTitle.style.color = '#495057';

                this.mapContainer.innerHTML = '';
                this.mapContainer.appendChild(mapTitle);
                this.mapContainer.appendChild(svgElement);
            }
        } catch (error) {
            console.error('Failed to load USA map SVG:', error);
            this.createFallbackMap();
        }
    }

    convertStateCodeToId(stateCode) {
        // Convert state codes to full names with dashes
        const stateMapping = {
            'AL': 'alabama', 'AK': 'alaska', 'AZ': 'arizona', 'AR': 'arkansas',
            'CA': 'california', 'CO': 'colorado', 'CT': 'connecticut', 'DE': 'delaware',
            'FL': 'florida', 'GA': 'georgia', 'HI': 'hawaii', 'ID': 'idaho',
            'IL': 'illinois', 'IN': 'indiana', 'IA': 'iowa', 'KS': 'kansas',
            'KY': 'kentucky', 'LA': 'louisiana', 'ME': 'maine', 'MD': 'maryland',
            'MA': 'massachusetts', 'MI': 'michigan', 'MN': 'minnesota', 'MS': 'mississippi',
            'MO': 'missouri', 'MT': 'montana', 'NE': 'nebraska', 'NV': 'nevada',
            'NH': 'new-hampshire', 'NJ': 'new-jersey', 'NM': 'new-mexico', 'NY': 'new-york',
            'NC': 'north-carolina', 'ND': 'north-dakota', 'OH': 'ohio', 'OK': 'oklahoma',
            'OR': 'oregon', 'PA': 'pennsylvania', 'RI': 'rhode-island', 'SC': 'south-carolina',
            'SD': 'south-dakota', 'TN': 'tennessee', 'TX': 'texas', 'UT': 'utah',
            'VT': 'vermont', 'VA': 'virginia', 'WA': 'washington', 'WV': 'west-virginia',
            'WI': 'wisconsin', 'WY': 'wyoming', 'DC': 'district-of-columbia'
        };
        return stateMapping[stateCode] || stateCode.toLowerCase();
    }

    createFallbackMap() {
        // Fallback to simple shapes if SVG loading fails
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 1000 500');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', 'auto');

        // Create a simple fallback message
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '500');
        text.setAttribute('y', '250');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#666');
        text.setAttribute('font-size', '24');
        text.textContent = 'Map loading failed. Please refresh the page.';

        svg.appendChild(text);

        const mapTitle = document.createElement('div');
        mapTitle.className = 'map-title';
        mapTitle.textContent = 'United States Map';
        mapTitle.style.textAlign = 'center';
        mapTitle.style.marginBottom = '1rem';
        mapTitle.style.fontWeight = 'bold';
        mapTitle.style.color = '#495057';

        this.mapContainer.innerHTML = '';
        this.mapContainer.appendChild(mapTitle);
        this.mapContainer.appendChild(svg);
    }

    formatStateName(stateId) {
        return stateId.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    highlightState(stateId) {
        // Clear previous highlight
        this.clearMapHighlight();

        // Find and highlight the new state
        const stateElement = document.getElementById(`state-${stateId}`);
        if (stateElement) {
            stateElement.classList.add('highlighted');
            this.currentHighlightedState = stateId;
        }
    }

    clearMapHighlight() {
        if (this.currentHighlightedState) {
            const currentElement = document.getElementById(`state-${this.currentHighlightedState}`);
            if (currentElement) {
                currentElement.classList.remove('highlighted');
            }
            this.currentHighlightedState = null;
        }

        // Also clear any other highlighted states (backup)
        const allHighlighted = document.querySelectorAll('.usa-map-state.highlighted');
        allHighlighted.forEach(element => {
            element.classList.remove('highlighted');
        });
    }
}

// Global functions for integration with quiz app
let usaMap;

function initializeMap() {
    usaMap = new USAMap();
}

function highlightState(stateId) {
    if (usaMap) {
        usaMap.highlightState(stateId);
    }
}

function clearMapHighlight() {
    if (usaMap) {
        usaMap.clearMapHighlight();
    }
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
});

// Make functions available globally
window.highlightState = highlightState;
window.clearMapHighlight = clearMapHighlight;
