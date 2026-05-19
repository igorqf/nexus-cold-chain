// admin-builder.js

window.CrudBuilder = {
    build: (config) => {
        return {
            render: () => {
                const searchRow = `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 24px;">
                        <div class="search-bar" style="width: 300px; border: 1px solid var(--border-color);">
                            <i data-lucide="search" size="18" class="text-muted"></i>
                            <input type="text" placeholder="Buscar..." id="crudSearch">
                        </div>
                        <button class="btn btn-primary" onclick="CrudBuilder.openFormModal('${config.id}')">
                            <i data-lucide="plus" size="18"></i> Novo Cadastro
                        </button>
                    </div>
                `;

                const tableHeader = config.columns.map(c => `<th>${c.label}</th>`).join('');
                const tableBody = config.data.length > 0 ? config.data.map((row, idx) => {
                    const cells = config.columns.map(c => {
                        let val = row[c.key] || '-';
                        if (c.key === 'status') {
                            const badge = val === 'Ativo' || val === 'Online' || val === 'Sucesso' || val === 'Em operação' ? 'badge-normal' : 
                                         (val === 'Inativo' || val === 'Offline' ? 'badge-offline' : 
                                         (val === 'Crítico' || val === 'Alta' ? 'badge-critical' : 'badge-warning'));
                            val = `<span class="badge ${badge}">${val}</span>`;
                        }
                        return `<td>${val}</td>`;
                    }).join('');
                    
                    return `
                        <tr>
                            ${cells}
                            <td style="text-align: right; white-space: nowrap;">
                                <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.8rem;" title="Editar" onclick="CrudBuilder.editItem('${config.id}', ${idx})"><i data-lucide="edit-2" size="14"></i></button>
                                <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.8rem;" title="Inativar/Excluir" onclick="CrudBuilder.deleteItem('${config.id}', ${idx})"><i data-lucide="trash-2" size="14" style="color: var(--status-critical);"></i></button>
                            </td>
                        </tr>
                    `;
                }).join('') : `<tr><td colspan="${config.columns.length + 1}" style="text-align: center; padding: 24px; color: var(--text-secondary);">Nenhum registro encontrado.</td></tr>`;

                // Split fields into 2 columns if more than 5 fields
                const formFieldsHTML = `<div class="grid ${config.fields.length > 4 ? 'grid-cols-2' : ''}" style="gap: 16px;">` + 
                    config.fields.map(f => {
                        if (f.type === 'select') {
                            const opts = (f.options || []).map(o => `<option value="${o}">${o}</option>`).join('');
                            return `<div class="form-group" style="margin-bottom:0;"><label>${f.label}</label><select class="form-control" id="field-${f.key}"><option value="">Selecione...</option>${opts}</select></div>`;
                        } else if (f.type === 'textarea') {
                            return `<div class="form-group col-span-2" style="margin-bottom:0; grid-column: 1 / -1;"><label>${f.label}</label><textarea class="form-control" rows="3" id="field-${f.key}"></textarea></div>`;
                        }
                        return `<div class="form-group" style="margin-bottom:0;"><label>${f.label}</label><input type="${f.type || 'text'}" class="form-control" id="field-${f.key}"></div>`;
                    }).join('') + `</div>`;

                return `
                    ${Components.Sidebar(config.id)}
                    <div class="main-content">
                        ${Components.Header(config.title, 'Nexus / ' + (config.group || 'Cadastros') + ' / ' + config.title)}
                        <div class="page-container" style="position: relative;">
                            <div class="card">
                                ${searchRow}
                                <div class="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                ${tableHeader}
                                                <th style="text-align: right;">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${tableBody}
                                        </tbody>
                                    </table>
                                </div>
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; font-size: 0.85rem; color: var(--text-secondary);">
                                    <span>Mostrando ${config.data.length} de ${config.data.length} registros</span>
                                    <div class="flex gap-2">
                                        <button class="btn btn-secondary" style="padding: 4px 8px;" disabled>Anterior</button>
                                        <button class="btn btn-primary" style="padding: 4px 8px;">1</button>
                                        <button class="btn btn-secondary" style="padding: 4px 8px;" disabled>Próximo</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Form Modal -->
                    <div id="modal-${config.id}" class="modal-overlay" style="display: none; z-index: 9999;">
                        <div class="modal" style="max-width: 700px; width: 90%; max-height: 90vh; display: flex; flex-direction: column;">
                            <div class="modal-header">
                                <h2 id="modal-title-${config.id}" style="font-size: 1.25rem;">Novo Cadastro: ${config.title}</h2>
                                <button class="btn btn-secondary" style="padding: 4px; border: none;" onclick="CrudBuilder.closeFormModal('${config.id}')"><i data-lucide="x" size="20"></i></button>
                            </div>
                            <div class="modal-body" style="overflow-y: auto; flex: 1;">
                                ${formFieldsHTML}
                            </div>
                            <div class="modal-footer" style="background: var(--bg-color); border-bottom-left-radius: var(--border-radius-lg); border-bottom-right-radius: var(--border-radius-lg);">
                                <button class="btn btn-secondary" onclick="CrudBuilder.closeFormModal('${config.id}')">Cancelar</button>
                                <button class="btn btn-primary" onclick="CrudBuilder.saveForm('${config.id}')">Salvar Registro</button>
                            </div>
                        </div>
                    </div>
                `;
            },
            afterRender: () => {
                lucide.createIcons();
                window[`crud_config_${config.id}`] = config;
            }
        };
    },
    
    openFormModal: (id) => {
        document.getElementById(`modal-${id}`).style.display = 'flex';
        document.getElementById(`modal-title-${id}`).innerText = 'Novo Cadastro';
        // Limpar inputs
        const modal = document.getElementById(`modal-${id}`);
        const inputs = modal.querySelectorAll('input, select, textarea');
        inputs.forEach(i => i.value = '');
    },
    closeFormModal: (id) => {
        document.getElementById(`modal-${id}`).style.display = 'none';
    },
    editItem: (id, idx) => {
        const config = window[`crud_config_${id}`];
        const data = config.data[idx];
        CrudBuilder.openFormModal(id);
        document.getElementById(`modal-title-${id}`).innerText = 'Editar Cadastro';
        
        // Populate inputs
        config.fields.forEach(f => {
            const el = document.getElementById(`field-${f.key}`);
            if (el && data[f.key]) {
                el.value = data[f.key];
            }
        });
    },
    deleteItem: (id, idx) => {
        if(confirm('Tem certeza que deseja inativar/excluir este registro?\nIsso registrará uma ação no log de auditoria.')) {
            alert('Exclusão lógica mockada com sucesso. Status alterado para Inativo.');
        }
    },
    saveForm: (id) => {
        const modal = document.getElementById(`modal-${id}`);
        const inputs = modal.querySelectorAll('input[type="text"], input[type="email"]');
        let valid = true;
        inputs.forEach(i => {
            if(!i.value) valid = false;
        });
        
        // Simples validação visual
        if(!valid) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        alert('Registro salvo com sucesso!');
        CrudBuilder.closeFormModal(id);
    }
};
