# Election Results Visualization

## Overview

This project is a dynamic election results visualization tool that I built to display voting data through interactive and responsive charts. The core feature is a smooth animated donut chart rendered with the HTML5 Canvas API, accompanied by legends and textual insights that adapt to different screen sizes and themes.

---

## My Approach

I designed the HTML with semantic structure and clear element IDs/classes, making it easy to target and update elements via JavaScript. My CSS focuses on creating a responsive layout that adjusts gracefully to mobile and desktop views, with smooth transitions when toggling between light and dark themes.

In JavaScript, I control the drawing and animation of the charts, using easing functions for a polished load effect. I pay close attention to details such as font sizes and abbreviations, especially on smaller screens, to keep the interface clear and readable.

I handle user interactions like switching between chart views and toggling themes with smooth icon animations, and I update the displayed data dynamically to reflect the latest vote counts. Additionally, I listen for window resize and device orientation changes, debouncing these events to prevent performance issues and ensure the visuals adjust seamlessly.

---

## Assumptions I Made

- HTML elements have the expected IDs and classes for JavaScript selectors.
- CSS variables and classes for themes are properly set up.
- Fonts like "Inter" are loaded correctly across devices.
- Candidate data is formatted and sorted before being passed to the chart functions.
- Canvas contexts are cleared and reset properly during redraws.
- The `isSmallScreen` flag reliably detects smaller screen widths for responsive adjustments.
- Vote counts are positive numbers and formatted for readability, using abbreviations when appropriate.
- Users might switch themes or rotate their devices, so I accounted for smooth transitions and re-renders on these events.
- The UI should be responsive, interactive, and performant across different devices.

---

## Features

- Animated donut chart showing voting percentages.
- Dynamic legend with color-coded parties and candidate info.
- Responsive typography and layout adjustments for smaller screens.
- Light/dark theme toggle with smooth icon animations.
- Real-time updates of leading candidate and winning margin insights.
- Event listeners for window resize and device orientation changes with debounced redraws.

---

## How to Use

1. Open the `index.html` file in any modern browser.
2. View the animated chart displaying election results.
3. Use the theme toggle button to switch between light and dark modes.
4. Resize your browser or rotate your device to see responsive adjustments.
5. Switch between different views (cards/table) using the provided controls.
