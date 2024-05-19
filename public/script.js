document.addEventListener('DOMContentLoaded', function() {
    const employeesByCompany = {
        "NTC": ["Abel Nunes"],
        "TMI": ["Claudionor Aparecido da Silva", 
                "Eduardo Henrique da Silva", 
                "Braulino Aparecido Rodrigues", 
                "Francisco Rodrigues",
                "Manoel de Oliveira Furtado"],
        "Air Clean": ["Edson de Souza Moreno", 
                "Gilvan Soares da Silva", 
                "José Alfredo da Silva Neto", 
                "José Fred da Silva", 
                "Renan Barbosa de Lima"],
        "Tank": ["Adelson Aires de Alcântara", 
                "Guilherme Rangel Messias", 
                "Ricardo Alessandro Rodrigues"],
    };

    const companyDropdown = document.getElementById('company');
    const employeeDropdown = document.getElementById('employee');
    const checkAllCheckbox = document.getElementById('checkAll');
    const dayCheckboxes = document.querySelectorAll('input[type="checkbox"][name="days"]');
    const form = document.getElementById('hoursForm');

    companyDropdown.addEventListener('change', function() {
        const selectedCompany = this.value;
        const employees = employeesByCompany[selectedCompany] || [];

        employeeDropdown.innerHTML = '';

        employees.forEach(function(employee) {
            const option = document.createElement('option');
            option.text = employee;
            option.value = employee;
            employeeDropdown.add(option);
        });
    });

    checkAllCheckbox.addEventListener('change', function() {
        dayCheckboxes.forEach(function(checkbox) {
            checkbox.checked = checkAllCheckbox.checked;
        });
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {
            company: formData.get('company'),
            employee: formData.get('employee'),
            days: formData.getAll('days')
        };

        fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            const resultDiv = document.getElementById('result');
            resultDiv.textContent = `Total de horas trabalhadas: ${result.totalHours} horas`;
            resultDiv.style.display = 'block';

            clearForm();
        })
        .catch(error => console.error('Error:', error));
    });

    function clearForm() {
        companyDropdown.selectedIndex = 0;
        employeeDropdown.innerHTML = '';
        dayCheckboxes.forEach(function(checkbox) {
            checkbox.checked = false;
        });
        checkAllCheckbox.checked = false;
    }
});
