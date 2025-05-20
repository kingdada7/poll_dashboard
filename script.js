document.addEventListener("DOMContentLoaded", () => {
  // Election data
  const candidates = [
    { name: "John Doe", party: "ABC", votes: 1500 },
    { name: "Jane Smith", party: "DEF", votes: 2000 },
    { name: "Bob Johnson", party: "GHI", votes: 1200 },
  ]

  // Sort candidates by votes (descending)
  candidates.sort((a, b) => b.votes - a.votes)

  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0)

  // Update total votes display
  document.getElementById("totalVotes").textContent = totalVotes.toLocaleString()

  // Update last updated time
  updateLastUpdatedTime()

  // Render candidate cards and table
  renderCandidateCards(candidates, totalVotes)
  renderCandidateTable(candidates, totalVotes)

  // Initialize charts
  initializeCharts(candidates, totalVotes)

  // Update insights
  updateInsights(candidates, totalVotes)

  // Set up chart toggle buttons
  document.getElementById("barChartBtn").addEventListener("click", function () {
    setActiveChart("barChart")
    this.classList.add("active")
    document.getElementById("pieChartBtn").classList.remove("active")
  })

  document.getElementById("pieChartBtn").addEventListener("click", function () {
    setActiveChart("pieChart")
    this.classList.add("active")
    document.getElementById("barChartBtn").classList.remove("active")
  })

  // Set up view toggle buttons
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const view = this.dataset.view
      setActiveView(view)

      document.querySelectorAll(".view-btn").forEach((b) => b.classList.remove("active"))
      this.classList.add("active")
    })
  })

  // Set up theme toggle
  initializeThemeToggle()
})

function updateLastUpdatedTime() {
  const now = new Date()
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
  document.getElementById("lastUpdated").textContent = now.toLocaleDateString("en-US", options)
}

function renderCandidateCards(candidates, totalVotes) {
  const candidatesGrid = document.getElementById("candidatesGrid")
  candidatesGrid.innerHTML = "" // Clear existing content

  candidates.forEach((candidate, index) => {
    const percentage = ((candidate.votes / totalVotes) * 100).toFixed(1)
    const card = document.createElement("div")
    card.className = `candidate-card party-${candidate.party}`
    card.style.animationDelay = `${index * 0.2}s`

    card.innerHTML = `
      <div class="candidate-header">
        <div class="candidate-info">
          <div class="candidate-name">${candidate.name}</div>
          <div class="candidate-party party-${candidate.party}">Party ${candidate.party}</div>
        </div>
        <div class="candidate-rank rank-${index + 1}">${index + 1}</div>
      </div>
      <div class="vote-info">
        <div class="vote-count party-${candidate.party}">${candidate.votes.toLocaleString()}</div>
        <div class="vote-percentage">${percentage}%</div>
      </div>
      <div class="progress-container">
        <div class="progress-label">
          <span>Votes</span>
          <span>${percentage}% of total</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill party-${candidate.party}"></div>
        </div>
      </div>
    `

    candidatesGrid.appendChild(card)

    // Animate progress bar after a short delay
    setTimeout(
      () => {
        const progressFill = card.querySelector(".progress-fill")
        progressFill.style.width = `${percentage}%`
      },
      300 + index * 200,
    )
  })
}

function renderCandidateTable(candidates, totalVotes) {
  const candidatesTable = document.getElementById("candidatesTable")
  candidatesTable.innerHTML = "" // Clear existing content

  candidates.forEach((candidate, index) => {
    const percentage = ((candidate.votes / totalVotes) * 100).toFixed(1)
    const row = document.createElement("tr")

    row.innerHTML = `
      <td><div class="table-rank rank-${index + 1}">${index + 1}</div></td>
      <td>${candidate.name}</td>
      <td><div class="table-party party-${candidate.party}">Party ${candidate.party}</div></td>
      <td class="table-votes">${candidate.votes.toLocaleString()}</td>
      <td class="table-percentage">${percentage}%</td>
    `

    candidatesTable.appendChild(row)
  })
}

function getColorForParty(party) {
  const isDarkMode = document.documentElement.classList.contains("dark")

  const colors = {
    ABC: isDarkMode ? "rgb(96, 165, 250)" : "rgb(59, 130, 246)", // Blue
    DEF: isDarkMode ? "rgb(52, 211, 153)" : "rgb(16, 185, 129)", // Green
    GHI: isDarkMode ? "rgb(251, 191, 36)" : "rgb(245, 158, 11)", // Amber
  }

  return colors[party] || (isDarkMode ? "#94a3b8" : "#9ca3af") // Default gray if party not found
}

function initializeCharts(candidates, totalVotes) {
  // Initialize Bar Chart
  initBarChart(candidates, totalVotes)

  // Initialize Pie Chart
  initPieChart(candidates, totalVotes)
}

// Replace the initBarChart function with this improved version
function initBarChart(candidates, totalVotes) {
  const canvas = document.getElementById("barChart")
  const ctx = canvas.getContext("2d")

  // Set canvas dimensions with device pixel ratio for sharper rendering
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.parentElement.getBoundingClientRect()

  // Clear any previous content
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  canvas.style.width = `${rect.width}px`
  canvas.style.height = `${rect.height}px`
  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Determine if we're on a small screen
  const isSmallScreen = window.innerWidth <= 480
  const isMediumScreen = window.innerWidth <= 768 && window.innerWidth > 480
  const isLandscape = window.innerHeight < 500 && window.innerWidth > window.innerHeight

  // Chart dimensions - improved for better proportions and mobile
  const chartWidth = rect.width * (isSmallScreen ? 0.9 : 0.85)
  const chartHeight = rect.height * (isSmallScreen ? 0.55 : isLandscape ? 0.6 : 0.65)
  const chartX = (rect.width - chartWidth) / 2
  const chartY = rect.height * (isSmallScreen ? 0.25 : isLandscape ? 0.2 : 0.2)

  // Improved bar spacing and width calculations for mobile
  const barCount = candidates.length
  // Adjust bar width based on screen size
  const maxBarWidth = isSmallScreen ? 25 : isMediumScreen ? 35 : 45
  // Ensure bars don't get too wide on small screens
  const barWidth = Math.min(chartWidth / (barCount * 2), maxBarWidth)
  // Calculate spacing to center the bars
  const totalBarsWidth = barWidth * barCount
  const totalSpacingWidth = chartWidth - totalBarsWidth
  const barSpacing = totalSpacingWidth / (barCount + 1)

  // Find maximum votes for scaling
  const maxVotes = Math.max(...candidates.map((c) => c.votes))
  // Add 10% padding to max value for better visualization
  const chartMaxVotes = maxVotes * 1.1

  // Get theme variables
  const isDarkMode = document.documentElement.classList.contains("dark")
  const chartBgColor =
    getComputedStyle(document.documentElement).getPropertyValue("--chart-background").trim() ||
    (isDarkMode ? "#1e293b" : "#f8f9fa")
  const chartGridColor =
    getComputedStyle(document.documentElement).getPropertyValue("--chart-grid").trim() ||
    (isDarkMode ? "#334155" : "#e5e7eb")
  const textPrimaryColor =
    getComputedStyle(document.documentElement).getPropertyValue("--chart-text").trim() ||
    (isDarkMode ? "#f1f5f9" : "#1f2937")
  const textSecondaryColor =
    getComputedStyle(document.documentElement).getPropertyValue("--chart-text-secondary").trim() ||
    (isDarkMode ? "#cbd5e1" : "#6b7280")

  // Draw chart background with rounded corners
  ctx.fillStyle = chartBgColor
  ctx.beginPath()
  roundedRect(ctx, chartX, chartY, chartWidth, chartHeight, 8)
  ctx.fill()

  // Draw horizontal grid lines
  ctx.strokeStyle = chartGridColor
  ctx.lineWidth = 1

  // Adjust grid lines for small screens
  const gridLines = isSmallScreen ? 2 : 4
  for (let i = 0; i <= gridLines; i++) {
    const y = chartY + chartHeight - (i / gridLines) * chartHeight

    // Draw dashed grid line
    ctx.beginPath()
    ctx.setLineDash([4, 4])
    ctx.moveTo(chartX, y)
    ctx.lineTo(chartX + chartWidth, y)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw y-axis labels
    ctx.fillStyle = textSecondaryColor
    ctx.font = `600 ${isSmallScreen ? 8 : 10}px Inter, sans-serif`
    ctx.textAlign = "right"
    const labelValue = Math.round((i / gridLines) * chartMaxVotes)
    ctx.fillText(labelValue.toLocaleString(), chartX - 5, y + 3)
  }

  // Draw chart title
  ctx.fillStyle = textPrimaryColor
  ctx.font = `600 ${isSmallScreen ? 10 : 12}px Inter, sans-serif`
  ctx.textAlign = "center"
  ctx.fillText("Votes by Candidate", rect.width / 2, isSmallScreen ? 12 : 15)

  // Draw bars with animation - with a slight delay between each bar
  candidates.forEach((candidate, index) => {
    const barHeight = (candidate.votes / chartMaxVotes) * chartHeight
    // Calculate bar position to center the bars
    const barX = chartX + barSpacing + index * (barWidth + barSpacing)
    const barY = chartY + chartHeight - barHeight

    // Draw x-axis labels - adjust font size for mobile
    ctx.fillStyle = textPrimaryColor
    ctx.font = `600 ${isSmallScreen ? 8 : 10}px Inter, sans-serif`
    ctx.textAlign = "center"

    // For small screens, abbreviate long names
    let displayName = candidate.name
    if (displayName.length > 6) {
      const nameParts = displayName.split(" ")
      if (nameParts.length > 1) {
        displayName = `${nameParts[0].substring(0, 3)}. ${nameParts[1].charAt(0)}.`
      } else {
        displayName = displayName.substring(0, 6) + "."
      }
    }

    // Position labels with more space on small screens
    const labelY = chartY + chartHeight + (isSmallScreen ? 12 : 15)
    ctx.fillText(displayName, barX + barWidth / 2, labelY)

    // Draw party label - smaller or hidden on small screens
    if (!isSmallScreen) {
      ctx.fillStyle = textSecondaryColor
      ctx.font = `500 ${isSmallScreen ? 8 : 9}px Inter, sans-serif`
      ctx.fillText(`${candidate.party}`, barX + barWidth / 2, labelY + (isSmallScreen ? 10 : 12))
    }

    // Animate bar height with a delay based on index
    setTimeout(() => {
      animateBar(ctx, barX, barY + barHeight, barWidth, barHeight, getColorForParty(candidate.party), 1200, 6)

      // Draw vote count above bar after a short delay
      setTimeout(() => {
        // Format numbers for small screens
        let voteDisplay = candidate.votes.toLocaleString()
        if (candidate.votes >= 1000) {
          voteDisplay = `${(candidate.votes / 1000).toFixed(1)}K`
        }

        // Draw vote count above bar - adjust for small screens
        ctx.fillStyle = textPrimaryColor
        ctx.font = `700 ${isSmallScreen ? 8 : 10}px Inter, sans-serif`
        ctx.textAlign = "center"

        // Position vote count with enough space from bar top
        ctx.fillText(voteDisplay, barX + barWidth / 2, barY - (isSmallScreen ? 6 : 8))
      }, 1200) // Add after animation completes
    }, index * 100) // Stagger the animations
  })
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

// Replace the entire animateBar function with this improved version
function animateBar(ctx, x, y, width, targetHeight, color, duration, radius = 0) {
  const startTime = performance.now()
  let animationFrameId = null

  // Store the initial state to properly clear the entire area
  const clearHeight = targetHeight * 1.2 // Add some extra space for safety
  const clearY = y - clearHeight
  const clearWidth = width + 4 // Add some padding
  const clearX = x - 2

  function draw(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    // Use easeOutElastic for a bouncy effect
    const easedProgress = easeOutElastic(progress)
    const currentHeight = targetHeight * easedProgress

    // Clear the entire bar area completely
    ctx.clearRect(clearX, clearY, clearWidth, clearHeight + 40)

    // Draw bar with rounded top corners
    ctx.fillStyle = color
    ctx.shadowColor = "transparent" // Reset shadow before drawing

    if (radius > 0) {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, y - currentHeight + radius)
      ctx.quadraticCurveTo(x, y - currentHeight, x + radius, y - currentHeight)
      ctx.lineTo(x + width - radius, y - currentHeight)
      ctx.quadraticCurveTo(x + width, y - currentHeight, x + width, y - currentHeight + radius)
      ctx.lineTo(x + width, y)
      ctx.closePath()

   

      // Add subtle shadow for depth only after animation completes
      if (progress === 1) {
        ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
        ctx.shadowBlur = 3
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 2
        ctx.fill()
        ctx.shadowColor = "transparent" // Reset shadow
      }
    } else {
      ctx.fillRect(x, y - currentHeight, width, currentHeight)
    }

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(draw)
    }
  }

  // Cancel any existing animation before starting a new one
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  animationFrameId = requestAnimationFrame(draw)
}

// Elastic easing function for animations
function easeOutElastic(x) {
  const c4 = (2 * Math.PI) / 3

  return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1
}

// Improve the pie chart for mobile
function initPieChart(candidates, totalVotes) {
  const canvas = document.getElementById("pieChart")
  const ctx = canvas.getContext("2d")

  // Set canvas dimensions with device pixel ratio
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.parentElement.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  canvas.style.width = `${rect.width}px`
  canvas.style.height = `${rect.height}px`
  ctx.scale(dpr, dpr)

  // Determine if we're on a small screen
  const isSmallScreen = window.innerWidth <= 480
  const isMediumScreen = window.innerWidth <= 768 && window.innerWidth > 480
  const isLandscape = window.innerHeight < 500 && window.innerWidth > window.innerHeight

  // Chart dimensions - adjusted for mobile
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  // Make pie chart smaller on mobile for better fit
  const radius = Math.min(centerX, centerY) * (isSmallScreen ? 0.4 : isLandscape ? 0.45 : 0.55)

  // Get theme variables
  const isDarkMode = document.documentElement.classList.contains("dark")
  const textPrimaryColor =
    getComputedStyle(document.documentElement).getPropertyValue("--chart-text").trim() ||
    (isDarkMode ? "#f1f5f9" : "#1f2937")
  const textSecondaryColor =
    getComputedStyle(document.documentElement).getPropertyValue("--chart-text-secondary").trim() ||
    (isDarkMode ? "#cbd5e1" : "#6b7280")
  const cardBackground =
    getComputedStyle(document.documentElement).getPropertyValue("--card-background").trim() ||
    (isDarkMode ? "#1e293b" : "#ffffff")

  // Draw pie chart with animation
  animatePieChart(
    ctx,
    centerX,
    centerY,
    radius,
    candidates,
    totalVotes,
    textPrimaryColor,
    cardBackground,
    isSmallScreen,
  )

  // Draw legend - adjust position for small screens
  // Move legend to bottom on small screens for better layout
  const legendX = isSmallScreen ? centerX - radius * 0.8 : rect.width * 0.65
  const legendY = isSmallScreen ? centerY + radius * 1.2 : rect.height * 0.25
  drawPieChartLegend(ctx, candidates, legendX, legendY, textPrimaryColor, textSecondaryColor, isSmallScreen)
}

// Update the pie chart animation for mobile
function animatePieChart(ctx, centerX, centerY, radius, candidates, totalVotes, textColor, centerColor, isSmallScreen) {
  const totalAngle = Math.PI * 2
  const duration = 1500
  const startTime = performance.now()

  function draw(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    // Use easeOutBack for a slight overshoot effect
    const easedProgress = easeOutBack(progress)
    const currentAngle = totalAngle * easedProgress

    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width / window.devicePixelRatio, ctx.canvas.height / window.devicePixelRatio)

    let startAngle = -Math.PI / 2 // Start from top (12 o'clock position)

    // Draw chart title - adjust for small screens
    ctx.fillStyle = textColor
    ctx.font = `600 ${isSmallScreen ? 10 : 12}px Inter, sans-serif`
    ctx.textAlign = "center"
    ctx.fillText("Vote Distribution", centerX, isSmallScreen ? 12 : 15)

    // Draw slices
    candidates.forEach((candidate, index) => {
      const sliceAngle = (candidate.votes / totalVotes) * currentAngle
      const endAngle = startAngle + sliceAngle

      // Draw slice
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()

      ctx.fillStyle = getColorForParty(candidate.party)
      ctx.fill()

      // Add shadow effect
      ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
      ctx.shadowBlur = 5
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1
      ctx.fill()
      ctx.shadowColor = "transparent"

      // Draw percentage if slice is big enough - adjust threshold for small screens
      const minAngleForLabel = isSmallScreen ? 0.5 : 0.3
      if (sliceAngle > minAngleForLabel && progress === 1) {
        const percentage = ((candidate.votes / totalVotes) * 100).toFixed(1)
        const midAngle = startAngle + sliceAngle / 2
        const textDistance = radius * 0.7
        const textX = centerX + Math.cos(midAngle) * textDistance
        const textY = centerY + Math.sin(midAngle) * textDistance

        ctx.fillStyle = "white"
        ctx.font = `700 ${isSmallScreen ? 10 : 12}px Inter, sans-serif`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`${percentage}%`, textX, textY)
      }

      startAngle = endAngle
    })

    // Draw center circle for donut effect
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.5, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fillStyle = centerColor
    ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
    ctx.shadowBlur = 3
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 1
    ctx.fill()
    ctx.shadowColor = "transparent"

    // Draw total votes in center - adjust for small screens
    if (progress === 1) {
      ctx.fillStyle = textColor
      ctx.font = `500 ${isSmallScreen ? 10 : 12}px Inter, sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("Total Votes", centerX, centerY - (isSmallScreen ? 8 : 10))

      // Format numbers for small screens
      let voteDisplay = totalVotes.toLocaleString()
      if (totalVotes >= 1000) {
        voteDisplay = `${(totalVotes / 1000).toFixed(1)}K`
      }

      ctx.font = `700 ${isSmallScreen ? 14 : 16}px Inter, sans-serif`
      ctx.fillText(voteDisplay, centerX, centerY + (isSmallScreen ? 8 : 10))
    }

    if (progress < 1) {
      requestAnimationFrame(draw)
    }
  }

  requestAnimationFrame(draw)
}

// Back easing function for animations
function easeOutBack(x) {
  const c1 = 1.70158
  const c3 = c1 + 1

  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

// Update the legend drawing for mobile
function drawPieChartLegend(ctx, candidates, x, y, textPrimaryColor, textSecondaryColor, isSmallScreen) {
  // Adjust line height for small screens
  const lineHeight = isSmallScreen ? 20 : 26

  candidates.forEach((candidate, index) => {
    const itemY = y + index * lineHeight

    // Draw color box with rounded corners - smaller on mobile
    const boxSize = isSmallScreen ? 10 : 14
    ctx.fillStyle = getColorForParty(candidate.party)
    roundedRect(ctx, x, itemY, boxSize, boxSize, 2)
    ctx.fill()

    // Draw candidate name - smaller on mobile
    ctx.fillStyle = textPrimaryColor
    ctx.font = `600 ${isSmallScreen ? 9 : 10}px Inter, sans-serif`
    ctx.textAlign = "left"
    ctx.textBaseline = "middle"

    // Abbreviate names on small screens
    let displayName = candidate.name
    if (displayName.length > 6) {
      const nameParts = displayName.split(" ")
      if (nameParts.length > 1) {
        displayName = `${nameParts[0].substring(0, 3)}. ${nameParts[1].charAt(0)}.`
      } else {
        displayName = displayName.substring(0, 6) + "."
      }
    }

    ctx.fillText(displayName, x + boxSize + 5, itemY + (isSmallScreen ? 5 : 7))

    // Draw party name - smaller or simplified on mobile
    ctx.fillStyle = textSecondaryColor
    ctx.font = `500 ${isSmallScreen ? 7 : 9}px Inter, sans-serif`

    // Format numbers for small screens
    let voteDisplay = candidate.votes.toLocaleString()
    if (candidate.votes >= 1000) {
      voteDisplay = `${(candidate.votes / 1000).toFixed(1)}K`
    }

    // Simplify text on small screens
    const partyText = `${candidate.party}: ${voteDisplay}`

    ctx.fillText(partyText, x + boxSize + 5, itemY + (isSmallScreen ? 14 : 17))
  })
}

function setActiveChart(chartId) {
  // Hide all charts
  document.querySelectorAll(".chart").forEach((chart) => {
    chart.classList.remove("active")
  })

  // Show selected chart
  document.getElementById(chartId).classList.add("active")
}

function setActiveView(viewName) {
  // Hide all views
  document.querySelectorAll(".cards-view, .table-view").forEach((view) => {
    view.classList.remove("active")
  })

  // Show selected view
  if (viewName === "cards") {
    document.querySelector(".cards-view").classList.add("active")
  } else if (viewName === "table") {
    document.querySelector(".table-view").classList.add("active")
  }
}

function updateInsights(candidates, totalVotes) {
  // Update leading candidate
  const leadingCandidate = candidates[0]
  const leadingPercentage = ((leadingCandidate.votes / totalVotes) * 100).toFixed(1)
  document.getElementById("leadingCandidate").textContent = `${leadingCandidate.name} (${leadingCandidate.party})`
  document.getElementById("leadingPercentage").textContent = `${leadingPercentage}%`

  // Update winning margin
  const margin = candidates[0].votes - candidates[1].votes
  const marginPercentage = ((margin / totalVotes) * 100).toFixed(1)
  document.getElementById("winningMargin").textContent = `${margin.toLocaleString()} votes`
  document.getElementById("marginPercentage").textContent = `${marginPercentage}%`
}

// Improve theme toggle functionality with smooth transitions
function initializeThemeToggle() {
  const themeToggle = document.getElementById("themeToggle")
  const sunIcon = document.getElementById("sunIcon")
  const moonIcon = document.getElementById("moonIcon")

  // Check for saved theme preference or respect OS preference
  const savedTheme = localStorage.getItem("theme")
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add("dark")
    sunIcon.style.display = "none"
    moonIcon.style.display = "block"
  } else {
    sunIcon.style.display = "block"
    moonIcon.style.display = "none"
  }

  // Toggle theme on button click with smooth animation
  themeToggle.addEventListener("click", () => {
    // Animate icons
    if (document.documentElement.classList.contains("dark")) {
      // Switching to light mode
      moonIcon.style.transform = "rotate(90deg) scale(0.5)"
      moonIcon.style.opacity = "0"

      setTimeout(() => {
        moonIcon.style.display = "none"
        sunIcon.style.display = "block"
        sunIcon.style.transform = "rotate(0) scale(1)"
        sunIcon.style.opacity = "1"
      }, 150)
    } else {
      // Switching to dark mode
      sunIcon.style.transform = "rotate(-90deg) scale(0.5)"
      sunIcon.style.opacity = "0"

      setTimeout(() => {
        sunIcon.style.display = "none"
        moonIcon.style.display = "block"
        moonIcon.style.transform = "rotate(0) scale(1)"
        moonIcon.style.opacity = "1"
      }, 150)
    }

    // Toggle the class with animation
    document.documentElement.classList.toggle("dark")

    // Add transition class to body for smooth color transitions
    document.body.classList.add("theme-transition")

    // Store preference
    localStorage.setItem("theme", document.documentElement.classList.contains("dark") ? "dark" : "light")

    // Redraw charts with new theme colors after a short delay for transition
    setTimeout(() => {
      const candidates = [
        { name: "John Doe", party: "ABC", votes: 1500 },
        { name: "Jane Smith", party: "DEF", votes: 2000 },
        { name: "Bob Johnson", party: "GHI", votes: 1200 },
      ]

      // Sort candidates by votes (descending)
      candidates.sort((a, b) => b.votes - a.votes)

      const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0)

      // Redraw charts with new theme
      initializeCharts(candidates, totalVotes)

      // Remove transition class
      document.body.classList.remove("theme-transition")
    }, 300)
  })
}

// Add orientation change handler with animation
window.addEventListener("orientationchange", () => {
  // Add transition class for smooth resizing
  document.body.classList.add("orientation-change")

  setTimeout(() => {
    // Reinitialize charts on orientation change
    const candidates = [
      { name: "John Doe", party: "ABC", votes: 1500 },
      { name: "Jane Smith", party: "DEF", votes: 2000 },
      { name: "Bob Johnson", party: "GHI", votes: 1200 },
    ]

    // Sort candidates by votes (descending)
    candidates.sort((a, b) => b.votes - a.votes)

    const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0)

    initializeCharts(candidates, totalVotes)

    // Remove transition class
    document.body.classList.remove("orientation-change")
  }, 300) // Small delay to allow the browser to complete the orientation change
})

// Add resize handler with debounce for better performance
let resizeTimer
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer)

  // Add transition class for smooth resizing
  document.body.classList.add("resize-transition")

  resizeTimer = setTimeout(() => {
    // Reinitialize charts on window resize
    const candidates = [
      { name: "John Doe", party: "ABC", votes: 1500 },
      { name: "Jane Smith", party: "DEF", votes: 2000 },
      { name: "Bob Johnson", party: "GHI", votes: 1200 },
    ]

    // Sort candidates by votes (descending)
    candidates.sort((a, b) => b.votes - a.votes)

    const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0)

    initializeCharts(candidates, totalVotes)

    // Remove transition class
    document.body.classList.remove("resize-transition")
  }, 250)
})
