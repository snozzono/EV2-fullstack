// ========================================
// FILE: services/newsletterService.js
// ========================================

const API_BASE_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:Qx1w8oou';

// Función para validar el formato del email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Función para verificar si el email existe en la base de datos
export const checkEmailExists = async (email) => {
  try {
    // GET: Query all newsletter_subscription records
    const response = await fetch(`${API_BASE_URL}/newsletter_subscription`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al verificar el email');
    }
    
    const subscriptions = await response.json();
    
    // Verificar si el email ya existe en la lista (campo 'correo')
    const emailExists = subscriptions.some(
      subscription => subscription.correo && subscription.correo.toLowerCase() === email.toLowerCase()
    );
    
    return emailExists;
  } catch (error) {
    console.error('Error en checkEmailExists:', error);
    throw error;
  }
};

// Función para guardar el email en la base de datos
export const saveEmail = async (email) => {
  try {
    // POST: Add newsletter_subscription record
    const response = await fetch(`${API_BASE_URL}/newsletter_subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        correo: email,    // Campo correcto: 'correo'
        activo: true      // Campo correcto: 'activo'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error al guardar:', errorData);
      throw new Error('Error al guardar el email');
    }
    
    const data = await response.json();
    console.log('Email guardado exitosamente:', data);
    return data;
  } catch (error) {
    console.error('Error en saveEmail:', error);
    throw error;
  }
};
