document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("pncForm");
    const manoObraCheckboxes = document.querySelectorAll(".manoObraCheckbox");
    const viaticos = document.getElementById("viaticos");
    const manoObraDetalles = document.getElementById("manoObraDetalles");
    const viaticosDetalles = document.getElementById("viaticosDetalles");

        // Función para limpiar el formulario
        function limpiarFormulario() {
            form.reset(); // Resetea los valores del formulario
            manoObraDetalles.innerHTML = ""; // Limpia los campos dinámicos de mano de obra
            viaticosDetalles.innerHTML = ""; // Limpia los campos dinámicos de viáticos
    
            // Opcional: desmarcar manualmente checkboxes o limpiar estilos dinámicos si es necesario
            const checkboxes = document.querySelectorAll(".manoObraCheckbox");
            checkboxes.forEach((checkbox) => {
                checkbox.checked = false;
            });
        }

    // Crear campos dinámicos para los checkboxes de mano de obra
    manoObraCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            const selectedCheckboxes = Array.from(manoObraCheckboxes).filter(cb => cb.checked);
            manoObraDetalles.innerHTML = "";

            selectedCheckboxes.forEach(checkbox => {
                manoObraDetalles.innerHTML += `
                    <div>
                        <label for="${checkbox.value}Personas">Cantidad de personas para ${checkbox.parentElement.textContent.trim()} *</label>
                        <input type="number" id="${checkbox.value}Personas" name="${checkbox.value}Personas" required>
                        <label for="${checkbox.value}Horas">Horas trabajadas por ${checkbox.parentElement.textContent.trim()} *</label>
                        <input type="number" id="${checkbox.value}Horas" name="${checkbox.value}Horas" required>
                    </div>
                `;
            });
        });
    });

    // Crear campos dinámicos para los viáticos
    viaticos.addEventListener("change", () => {
        viaticosDetalles.innerHTML = "";
        if (viaticos.value === "hospedaje" || viaticos.value === "ambos") {
            viaticosDetalles.innerHTML += `
                <label for="cantidadHospedados">Cantidad de personas hospedadas *</label>
                <input type="number" id="cantidadHospedados" name="cantidadHospedados" required>
                <label for="diasHospedaje">Cantidad de días para hospedaje *</label>
                <input type="number" id="diasHospedaje" name="diasHospedaje" required>
            `;
        }
        if (viaticos.value === "alimentacion" || viaticos.value === "ambos") {
            viaticosDetalles.innerHTML += `
                <label for="cantidadAlimentacion">Cantidad de personas alimentadas *</label>
                <input type="number" id="cantidadAlimentacion" name="cantidadAlimentacion" required>
                <label for="cantidadComidas">Cantidad de comidas *</label>
                <input type="number" id="cantidadComidas" name="cantidadComidas" required>
            `;
        }
    });

    // Manejar el envío del formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Recopilar datos del formulario
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        try {
            // Enviar los datos a Google Apps Script
            const response = await fetch("https://script.google.com/macros/s/AKfycbxw5fEYATvyMJ_7q_ixNWcWwPVGIMCX72-oCJ_ontlfhd28aNgot-aP-L19DCdxJlls/exec", {
                method: "POST",
                mode: "no-cors", // Desactiva las restricciones de CORS temporalmente
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.status === "success") {
                alert("Formulario enviado exitosamente.");
                limpiarFormulario()
                form.reset();
                manoObraDetalles.innerHTML = ""; // Limpiar campos dinámicos
                viaticosDetalles.innerHTML = ""; // Limpiar campos dinámicos
            } else {
                throw new Error(result.message || "Ocurrió un error al enviar el formulario.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Se presento un error en el formulario.");
            limpiarFormulario()
        }
    });
});
