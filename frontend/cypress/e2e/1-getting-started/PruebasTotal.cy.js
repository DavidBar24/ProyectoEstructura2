/// <reference types="cypress" />

// Base: http://localhost:3000 (frontend)
// API:  http://localhost:5006 (backend)

describe('Registro, Login y Registro de Mascota - Veterinaria', () => {
  const baseUrl = 'https://starlit-llama-c6e7ba.netlify.app';
  const apiUrl = 'https://avancesestructuras-production-1eb1.up.railway.app';

  before(() => {
    cy.clearLocalStorage();
  });

    it('1. Verificar pantalla de inicio de sesión', () => {
        cy.visit(`${baseUrl}/`);
        cy.get('h2.auth-login__title')
        .should('be.visible')
        .and('contain', 'Iniciar Sesión');
    });

        it('2. Registro de usuario y conservación de token', () => {
          // 1) Vamos directo a la ruta de registro
          cy.visit(`${baseUrl}/register`);

          // 2) Comprobamos que se muestra el encabezado
          cy.contains('h2', 'Registro').should('be.visible');

          // 3) Rellenamos campos con timeout extra por si tarda en renderizar
          cy.get('input[placeholder="Nombre"]', { timeout: 8000 })
            .should('be.visible')
            .type('usuarioTest');

          cy.get('input[placeholder="Edad"]')
            .should('be.visible')
            .type('30');

          cy.get('input[placeholder="Contraseña"]')
            .should('be.visible')
            .type('passTest123');

          // 4) Enviamos
          cy.get('button[type="submit"]').click();

          // 5) Verificamos token
          cy.window().its('localStorage.token').should('exist');
        });

        it('3. Login con el usuario creado', () => {
        cy.visit(`${baseUrl}/`);
        
        cy.get('input[placeholder="Nombre"]').type('usuarioTest');
        cy.get('input[placeholder="Contraseña"]').type('passTest123');
        cy.get('button[type="submit"]').click();
        cy.window().its('localStorage.token').should('be.a', 'string');
        });

        it('4. Registrar una mascota y verificar guardado', () => {
        cy.visit(`${baseUrl}/veterinaria`);
        cy.get('a.vet-btn__container[href="/Registrar-Mascota"]').click();

        cy.get('form.form-mascota').within(() => {
            cy.get('input').eq(0).type('Perro');
            cy.get('input').eq(1).type('Labrador');
            cy.get('input').eq(2).type('Firulais');
            cy.get('input').eq(3).type('5');
            cy.get('button.boton-registrar').click();
        });
    });
        it('5. Interactuar con el Creador de Perfiles Veterinarios', () => {
        cy.visit(`${baseUrl}/veterinaria`);
        cy.get('a[href="/crear-perfil"]').click();
        cy.url().should('include', '/crear-perfil');

        cy.get('input[type="text"]').first().type('Perfil Premium Completo');
        cy.contains('button', 'Guardar Nombre').click();

        cy.contains('.servicios-list button', 'Chequeo Anual').click();
        cy.contains('.servicios-list button', 'Plan Integral').click();
        cy.contains('.servicios-list button', 'Emergencia 24/7').click();

        cy.contains('.beneficios-list button', 'Descuento en Farmacia').click();
        cy.contains('.beneficios-list button', 'Guardería Gratis').click();
        cy.contains('.beneficios-list button', 'Asistencia Telefónica').click();

        cy.get('.resumen-perfil').within(() => {
        cy.contains('Servicios:').should('be.visible');
        cy.contains('Beneficios:').should('be.visible');
        cy.contains('Costo Total:').should('be.visible');
        });

        cy.contains('button', 'Reiniciar Perfil').click();

        cy.contains('Resumen de tu Perfil:').should('be.visible');
        cy.contains('Costo Total: $0/mes').should('be.visible');


        cy.visit(`${baseUrl}/veterinaria`);
        cy.url().should('eq', `${baseUrl}/veterinaria`);
  });
});
