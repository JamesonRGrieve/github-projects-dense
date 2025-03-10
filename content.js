(function() {
  function applyKanbanChanges() {
    // Create and inject CSS
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      /* Remove margin-bottom from cards and set max-width to half column width minus gap */
      .board-view-column-card {
        margin-bottom: 0 !important;
        max-width: calc(50% - 0.25rem) !important;
        display: inline-block !important;
      }
      
      /* Add flex-wrap and gap to column drop zone */
      .column-drop-zone {
        flex-wrap: wrap !important;
        gap: 0.5rem !important;
        display: flex !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Set up a MutationObserver to keep applying styles as GitHub loads content dynamically
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          // Check if we're viewing a project board
          if (window.location.pathname.includes('/projects')) {
            // We're on a project page, refresh our styles
            document.head.appendChild(styleElement.cloneNode(true));
          }
        }
      });
    });
    
    // Start observing the document body for DOM changes
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
  // Apply changes immediately
  applyKanbanChanges();
  
  // Also listen for page changes (GitHub is a SPA)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      // URL changed, check if we need to apply our changes
      if (window.location.pathname.includes('/projects')) {
        applyKanbanChanges();
      }
    }
  }).observe(document, { subtree: true, childList: true });
})();
