// Dashboard Tabs Controller
document.addEventListener('DOMContentLoaded', function() {
  // Get all tab buttons and panels
  const tabButtons = document.querySelectorAll('.dashboard-tabs .nav-link');
  const tabPanels = document.querySelectorAll('.tab-pane');
  
  // Add click event to each tab button
  tabButtons.forEach(function(button) {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all buttons and panels
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanels.forEach(panel => {
        panel.classList.remove('show', 'active');
      });
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Show corresponding panel
      const targetId = this.getAttribute('data-bs-target');
      const targetPanel = document.querySelector(targetId);
      if (targetPanel) {
        targetPanel.classList.add('show', 'active');
      }
    });
  });
});
