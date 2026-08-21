Cajero Automático CLI - Node.js & MongoDB

Proyecto de consola para la materia de Programación de 2º año. Implementa arquitectura limpia, principios S.O.L.I.D, patrones de diseño, transacciones atómicas y consultas avanzadas con MongoDB.

---

> ⚠️ **AVISO IMPORTANTE SOBRE BASE DE DATOS**  
> Este programa **requiere que tengas tu propio servidor local de MongoDB** ejecutándose en `mongodb://127.0.0.1:27017`.  
> Asegúrate de iniciar tu servicio de MongoDB (o contenedor Docker) antes de ejecutar la aplicación, o edita la URI en `db.js` si usas un puerto o credenciales distintas.

---

## 🛠️ Requisitos Previos

- **Node.js** (v16 o superior)
- **MongoDB** corriendo en `localhost` / `127.0.0.1` (puerto predeterminado `27017`)
- **NPM** (gestor de paquetes de Node)

---

## 📂 Estructura y Funcionamiento del Repositorio

El proyecto está modularizado para cumplir con el **Principio de Responsabilidad Única (SRP)** y evitar archivos gigantescos:

### 📄 Detalle de Módulos

1. **`db.js`**
   - Maneja la conexión directa con el driver nativo de MongoDB.
   - Apunta por defecto a `mongodb://127.0.0.1:27017`.

2. **`validations.js`**
   - Contiene la lógica aislada para validar entradas de usuario (montos positivos, formato de números de cuenta, etc.).

3. **`models/Account.js`**
   - **Herencia y Polimorfismo:** Implementa la clase base `Account` de la que heredan `SavingsAccount` (Cuenta de Ahorro) y `CheckingAccount` (Cuenta Monetaria).
   - Aplica **Liskov Substitution (LSP)** y **Open/Closed Principle (OCP)** para calcular tarifas y validar límites de saldo o sobregiros.

4. **`patterns/AccountFactory.js`**
   - **Patrón de Diseño (Factory):** Abstrae la creación de objetos de cuenta específicos a partir de los documentos BSON recuperados de MongoDB.

5. **`repositories/AccountRepository.js`**
   - **Patrón Repository:** Encapsula las consultas a la base de datos.
   - **Transacciones ACID:** Utiliza sesiones de MongoDB para realizar transferencias atómicas (descuenta de origen y acredita en destino dentro de un bloque seguro).
   - **Consultas Avanzadas:** Ejecuta un pipeline de agregación (`$facet`, `$group`, `$match`) para calcular métricas e historial reciente.

6. **`menu.js`**
   - Maneja la interfaz de consola interactiva con `readline` para mostrar el menú y capturar los datos ingresados.

7. **`index.js`**
   - Punto de entrada principal.
   - **Regla Estricta - Inmutabilidad:** Diseñado utilizando **recursividad asíncrona** para mantener el estado sin utilizar variables mutables (`let`), utilizando **únicamente `const`**.

---

## 🚀 Cómo Ejecutar el Proyecto

1. **Clonar o descargar el proyecto** en tu carpeta de preferencia.
2. **Instalar dependencias:**
   ```bash
   npm install mongodb
   ```
3. **Iniciar tu servicio de MongoDB local:**
   - *Windows:* `net start MongoDB`
   - *macOS/Linux:* `brew services start mongodb-community`
   - *Docker:* `docker run -d -p 27017:27017 --name mongo-cajero mongo:latest`
4. **Ejecutar la aplicación:**
   ```bash
   node index.js

