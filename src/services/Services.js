export const createEmployee = async (employeeData) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}:${process.env.REACT_APP_PROJECTS_PORT}${process.env.REACT_APP_ADMIN_API_ENDPOINT}/employee/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employeeData)
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}. Response: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error; // Re-throw to handle it in the caller
    }
};

// Example of updateEmployee function in services/Services.js
export const updateEmployee = async (empId, employeeData) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}:${process.env.REACT_APP_PROJECTS_PORT}${process.env.REACT_APP_ADMIN_API_ENDPOINT}/employee/edit/${empId}`;
    console.log('Request URL:', url);

    // Include email in the body
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ empId, ...employeeData }),
    });

    if (!response.ok) {
        console.error('Failed to update employee:', response.status, response.statusText);
        throw new Error('Failed to update employee');
    }

    return await response.json();
};




// employeeService.js
export const deleteAllEmployees = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}:${process.env.REACT_APP_PROJECTS_PORT}${process.env.REACT_APP_ADMIN_API_ENDPOINT}/employee/deleteAllHistory`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete all employees');
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting all employees:', error);
        throw error;
    }
};
