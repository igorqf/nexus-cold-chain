// App Router and State Management

const app = {
    root: document.getElementById('app'),
    currentPage: 'login',

    navigate: (page, params = null) => {
        app.currentPage = page;
        app.render(params);
    },

    render: (params) => {
        let content = '';
        let afterRenderFn = null;

        // Route map
        const routes = {
            'login': Pages.Login,
            'dashboard': Pages.Dashboard,
            'vehicle-detail': Pages.VehicleDetail || Pages.Dashboard, // Fallback if not loaded
            'alerts': Pages.Alerts || Pages.Dashboard,
            'maintenance': Pages.Maintenance || Pages.Dashboard,
            'traceability': Pages.Traceability || Pages.Dashboard,
            'executive': Pages.Executive || Pages.Dashboard,
            'sensors': Pages.Sensors || Pages.Dashboard,
            'rules': Pages.Rules || Pages.Dashboard,
            'reports': Pages.Reports || Pages.Dashboard
        };

        const pageModule = routes[app.currentPage];
        
        if (pageModule) {
            content = pageModule.render(params);
            afterRenderFn = pageModule.afterRender;
        } else {
            content = '<h1>404 - Page not found</h1>';
        }

        app.root.innerHTML = content;
        
        if (afterRenderFn) {
            afterRenderFn(params);
        }
    },

    showModal: () => {
        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            modalContainer.innerHTML = Components.AlertModal();
            lucide.createIcons();
        }
    },

    closeModal: () => {
        const modalContainer = document.getElementById('modal-container');
        if (modalContainer) {
            modalContainer.innerHTML = '';
        }
    },

    markAlertAsRead: (element) => {
        // Change UI state
        element.closest('tr').style.opacity = '0.5';
        element.closest('tr').querySelector('.badge').className = 'badge badge-normal';
        element.closest('tr').querySelector('.badge').innerText = 'Resolvido';
        element.innerText = 'Lido';
        element.disabled = true;
    }
};

// Start app
window.addEventListener('DOMContentLoaded', () => {
    app.render();
});
