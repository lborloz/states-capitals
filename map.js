// USA Map Implementation
class USAMap {
    constructor() {
        this.mapContainer = document.getElementById('usa-map');
        this.currentHighlightedState = null;
        this.createMap();
    }

    createMap() {
        // Create simplified SVG map of the USA
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 1000 600');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', 'auto');

        // Create simplified state shapes (rectangles positioned roughly geographically)
        const states = [
            // West Coast
            { id: 'california', x: 50, y: 300, width: 80, height: 120, name: 'California' },
            { id: 'oregon', x: 70, y: 220, width: 70, height: 80, name: 'Oregon' },
            { id: 'washington', x: 80, y: 150, width: 80, height: 70, name: 'Washington' },
            { id: 'nevada', x: 130, y: 280, width: 60, height: 100, name: 'Nevada' },
            { id: 'arizona', x: 190, y: 350, width: 70, height: 80, name: 'Arizona' },
            { id: 'utah', x: 190, y: 280, width: 60, height: 70, name: 'Utah' },
            { id: 'idaho', x: 160, y: 180, width: 60, height: 100, name: 'Idaho' },
            { id: 'alaska', x: 80, y: 480, width: 120, height: 80, name: 'Alaska' },
            { id: 'hawaii', x: 250, y: 500, width: 60, height: 40, name: 'Hawaii' },

            // Mountain West
            { id: 'montana', x: 220, y: 150, width: 100, height: 70, name: 'Montana' },
            { id: 'wyoming', x: 250, y: 220, width: 80, height: 60, name: 'Wyoming' },
            { id: 'colorado', x: 280, y: 280, width: 80, height: 70, name: 'Colorado' },
            { id: 'new-mexico', x: 260, y: 350, width: 80, height: 80, name: 'New Mexico' },
            { id: 'north-dakota', x: 320, y: 120, width: 80, height: 50, name: 'North Dakota' },
            { id: 'south-dakota', x: 330, y: 170, width: 80, height: 50, name: 'South Dakota' },
            { id: 'nebraska', x: 360, y: 220, width: 80, height: 50, name: 'Nebraska' },
            { id: 'kansas', x: 380, y: 270, width: 80, height: 50, name: 'Kansas' },
            { id: 'oklahoma', x: 400, y: 320, width: 90, height: 50, name: 'Oklahoma' },
            { id: 'texas', x: 380, y: 370, width: 120, height: 130, name: 'Texas' },

            // Midwest
            { id: 'minnesota', x: 410, y: 120, width: 70, height: 80, name: 'Minnesota' },
            { id: 'wisconsin', x: 480, y: 140, width: 60, height: 70, name: 'Wisconsin' },
            { id: 'iowa', x: 440, y: 200, width: 70, height: 50, name: 'Iowa' },
            { id: 'missouri', x: 460, y: 250, width: 70, height: 70, name: 'Missouri' },
            { id: 'arkansas', x: 490, y: 320, width: 60, height: 60, name: 'Arkansas' },
            { id: 'louisiana', x: 500, y: 380, width: 70, height: 70, name: 'Louisiana' },
            { id: 'illinois', x: 540, y: 180, width: 50, height: 90, name: 'Illinois' },
            { id: 'indiana', x: 590, y: 180, width: 50, height: 80, name: 'Indiana' },
            { id: 'michigan', x: 580, y: 130, width: 70, height: 80, name: 'Michigan' },
            { id: 'ohio', x: 640, y: 180, width: 60, height: 70, name: 'Ohio' },
            { id: 'kentucky', x: 600, y: 250, width: 80, height: 40, name: 'Kentucky' },
            { id: 'tennessee', x: 580, y: 290, width: 90, height: 40, name: 'Tennessee' },
            { id: 'mississippi', x: 550, y: 330, width: 50, height: 70, name: 'Mississippi' },
            { id: 'alabama', x: 600, y: 330, width: 50, height: 80, name: 'Alabama' },

            // South
            { id: 'florida', x: 680, y: 400, width: 90, height: 80, name: 'Florida' },
            { id: 'georgia', x: 650, y: 330, width: 60, height: 80, name: 'Georgia' },
            { id: 'south-carolina', x: 710, y: 320, width: 50, height: 60, name: 'South Carolina' },
            { id: 'north-carolina', x: 700, y: 270, width: 80, height: 50, name: 'North Carolina' },
            { id: 'virginia', x: 720, y: 220, width: 70, height: 50, name: 'Virginia' },
            { id: 'west-virginia', x: 680, y: 200, width: 50, height: 50, name: 'West Virginia' },

            // Northeast
            { id: 'pennsylvania', x: 740, y: 180, width: 80, height: 50, name: 'Pennsylvania' },
            { id: 'new-york', x: 780, y: 130, width: 70, height: 70, name: 'New York' },
            { id: 'vermont', x: 850, y: 120, width: 30, height: 50, name: 'Vermont' },
            { id: 'new-hampshire', x: 880, y: 120, width: 30, height: 50, name: 'New Hampshire' },
            { id: 'maine', x: 910, y: 100, width: 40, height: 80, name: 'Maine' },
            { id: 'massachusetts', x: 850, y: 170, width: 60, height: 30, name: 'Massachusetts' },
            { id: 'rhode-island', x: 910, y: 180, width: 20, height: 20, name: 'Rhode Island' },
            { id: 'connecticut', x: 820, y: 180, width: 40, height: 25, name: 'Connecticut' },
            { id: 'new-jersey', x: 790, y: 200, width: 35, height: 50, name: 'New Jersey' },
            { id: 'delaware', x: 770, y: 220, width: 20, height: 30, name: 'Delaware' },
            { id: 'maryland', x: 750, y: 230, width: 50, height: 30, name: 'Maryland' }
        ];

        // Create state elements
        states.forEach(state => {
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('id', `state-${state.id}`);
            rect.setAttribute('class', 'usa-map-state');
            rect.setAttribute('x', state.x);
            rect.setAttribute('y', state.y);
            rect.setAttribute('width', state.width);
            rect.setAttribute('height', state.height);
            rect.setAttribute('data-state-id', state.id);
            rect.setAttribute('data-state-name', state.name);
            
            // Add title for accessibility
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            title.textContent = state.name;
            rect.appendChild(title);

            svg.appendChild(rect);
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
        this.mapContainer.appendChild(svg);
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