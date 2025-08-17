# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a states and capitals quiz application for the USA that runs entirely in the browser using HTML, CSS, and JavaScript. The application should be responsive across desktop, tablet, and mobile viewports.

## Requirements

The quiz application must implement:
- Two separate quizzes: one for states and one for capitals
- Interactive USA map where each state changes to red when asking about that state's capital or name
- Multiple choice questions for US states and capitals
- Feedback for correct and incorrect answers
- Score tracking throughout the quiz
- "Start Over" button functionality
- Review of answers at the end of the quiz
- Responsive design for all device types

## Development Commands

Since this is a vanilla HTML/CSS/JavaScript project with no build tools:

- **Development**: Open `index.html` directly in a browser or use a local server:
  - `python -m http.server 8000` (Python 3)
  - `python -m SimpleHTTPServer 8000` (Python 2)
  - `npx serve .` (if Node.js is available)

- **Testing**: Open the application in different browsers and viewport sizes to test responsiveness

- **Deployment**: Push to GitHub repository and enable GitHub Pages to serve as static site

## Architecture

The application should follow a simple structure:

- `index.html` - Main HTML file with quiz interface and USA map
- `styles.css` - CSS for styling, responsive design, and map styling
- `script.js` - JavaScript for quiz logic, state management, and DOM manipulation
- `map.js` - SVG map handling and state highlighting functionality
- `data.js` - States and capitals data (if separated from main script)

## Key Implementation Notes

- Use vanilla JavaScript (no frameworks required)
- Implement responsive design with CSS media queries
- Store quiz state in memory (no persistent storage required)
- Include all 50 US states and their capitals
- Implement quiz type selection (states quiz vs capitals quiz)
- Create interactive SVG USA map with state highlighting
- Highlight the current question's state in red on the map
- Include "Start Over" functionality to reset quiz state
- Randomize question order for better user experience
- Provide immediate feedback after each question
- Calculate and display final score as percentage
- Ensure all assets use relative paths for GitHub Pages compatibility
- Design for static hosting (no server-side functionality required)