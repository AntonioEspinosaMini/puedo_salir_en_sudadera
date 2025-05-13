// ********* Codigo para dark mode ********
export function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
            
    // Comprobar si hay un tema guardado en localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Aplicar el tema guardado o usar el predeterminado
    if (savedTheme === 'dark') {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
    }
    
    // Manejar el clic en el botón de toggle
    themeToggle.addEventListener('click', function() {
        if (document.documentElement.classList.contains('dark')) {
            // Cambiar a modo claro
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
            localStorage.setItem('theme', 'light');
        } else {
            // Cambiar a modo oscuro
            document.documentElement.classList.remove('light');
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}
