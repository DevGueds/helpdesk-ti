// Accordion functionality for sidebar
document.addEventListener('DOMContentLoaded', function() {
  const accordionHeader = document.getElementById('monitoringAccordion');
  const accordionContent = document.getElementById('monitoringContent');
  
  if (accordionHeader && accordionContent) {
    console.log('✅ Accordion elements found!');
    
    // Load saved state from localStorage (default: expanded = false for collapsed)
    const isCollapsed = localStorage.getItem('monitoringAccordionCollapsed') === 'true';
    
    if (isCollapsed) {
      accordionHeader.classList.add('collapsed');
      accordionContent.classList.add('collapsed');
      console.log('📁 Accordion loaded as collapsed');
    } else {
      // Ensure it's expanded (remove any collapsed classes)
      accordionHeader.classList.remove('collapsed');
      accordionContent.classList.remove('collapsed');
      console.log('📂 Accordion loaded as expanded');
    }
    
    // Toggle on click
    accordionHeader.addEventListener('click', function() {
      const collapsed = accordionHeader.classList.toggle('collapsed');
      accordionContent.classList.toggle('collapsed');
      
      // Save state to localStorage
      localStorage.setItem('monitoringAccordionCollapsed', collapsed);
      console.log('🔄 Accordion toggled:', collapsed ? 'collapsed' : 'expanded');
    });
  } else {
    console.error('❌ Accordion elements not found!', {
      header: accordionHeader,
      content: accordionContent
    });
  }
});
