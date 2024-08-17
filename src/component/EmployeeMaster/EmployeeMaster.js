import React, { useState, useEffect } from 'react';
import { Box, Button, Flex, Table, ActionIcon, Pagination, Modal, TextInput, Loader, Group, Badge } from '@mantine/core';
import { IconEdit, IconTrash, IconUser, IconUserCog } from '@tabler/icons-react';
import AddEmployee from '../AddEmployee/AddEmployee';
import { useDisclosure } from '@mantine/hooks';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import noData from "../../assets/noData.jpg";

const activeStyle = {
    backgroundColor: 'skyblue',
    borderRadius: '10px',
    padding: '5px 10px',
    color: 'white'
};

const inactiveStyle = {
    backgroundColor: 'orange',
    borderRadius: '10px',
    padding: '5px 10px',
    color: 'white'
};

export default function EmployeeMaster() {
    const [employees, setEmployees] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(15);
    const [loading, setLoading] = useState(true);
    const [opened, { open, close }] = useDisclosure(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // Define searchQuery state

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}:${process.env.REACT_APP_PROJECTS_PORT}${process.env.REACT_APP_ADMIN_API_ENDPOINT}/employee/getAll`);
            const data = await response.json();
            const employeeArray = Array.isArray(data) ? data : [data];
            setEmployees(employeeArray);
            setTotalPages(Math.ceil(employeeArray.length / itemsPerPage));
        } catch (error) {
            toast.error('Failed to fetch data');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}:${process.env.REACT_APP_PROJECTS_PORT}${process.env.REACT_APP_ADMIN_API_ENDPOINT}/employee/bulk-upload`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    toast.success('File uploaded successfully');
                    fetchData();
                } else {
                    const errorMessage = await response.text();
                    toast.error(`Failed to upload file: ${errorMessage}`);
                    console.error('Error uploading file:', errorMessage);
                }
            } catch (error) {
                toast.error('Failed to upload file');
                console.error('Error uploading file:', error);
            }
        }
    };

    const removeEmployee = async (empId) => {
        console.log("Deleting employee with email:", empId); // Log the email
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}:${process.env.REACT_APP_PROJECTS_PORT}${process.env.REACT_APP_ADMIN_API_ENDPOINT}/employee/deleteByEmail/${empId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast.success('Employee removed successfully');
                fetchData();
            } else {
                const errorMessage = await response.text();
                toast.error(`Failed to remove employee: ${errorMessage}`);
                console.error('Error removing employee:', errorMessage);
            }
        } catch (error) {
            toast.error('Failed to remove employee');
            console.error('Error removing employee:', error);
        }
    };

    const handleEditEmployee = (employee) => {
        setCurrentEmployee(employee);
        setIsEditing(true);
        open();
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.currentTarget.value);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const filteredEmployees = employees.filter(employee =>
        (employee.first_name && employee.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (employee.last_name && employee.last_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (employee.email && employee.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const formatSalary = (salary) => {
        return salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace(/(\d+)(\d{2},)/, "$1,$2");
    };

    const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

    const rows = currentEmployees.map((employee) => (
        <Table.Tr key={employee._id}>
            <Table.Td>{employee.name}</Table.Td>
            <Table.Td>{employee.empId}</Table.Td>
            <Table.Td>{employee.email}</Table.Td>
            <Table.Td>{employee.phoneNo}</Table.Td>
            <Table.Td>{employee.designation}</Table.Td>
            <Table.Td> {employee.role === "Admin" ? (
                    <Badge
                        variant="outline"
                        color="yellow"
                        leftSection={<IconUserCog size={12} />}
                        style={{ padding: '0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', display: 'inline-flex', alignItems: 'center', width: '6rem', justifyContent: 'center' }}
                    >
                        {employee.role}
                    </Badge>
                ) : (
                    <Badge
                        variant="outline"
                        color="blue"
                        leftSection={<IconUser size={12} />}
                        style={{ padding: '0.5rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '500', display: 'inline-flex', alignItems: 'center', width: '6rem', justifyContent: 'center' }}
                    >
                        {employee.role}
                    </Badge>
                )}</Table.Td>
            <Table.Td>
                <span style={employee.is_active ? activeStyle : inactiveStyle}>
                    {employee.is_active ? 'Active' : 'Inactive'}
                </span>
            </Table.Td>
            <Table.Td>{formatSalary(employee.salary)}</Table.Td>
            <Table.Td>{employee.hkey}</Table.Td>
            <Table.Td>{employee.password}</Table.Td>

            <Table.Td colSpan="2">
                <Flex justify="space-between" p="10px">
                    <ActionIcon onClick={() => handleEditEmployee(employee)} c="#182452" bg="#ffffff">
                        <IconEdit c="#182452" size={25} />
                    </ActionIcon>
                    <ActionIcon onClick={() => removeEmployee(employee.email)} c="#182452" bg="#ffffff">
                        <IconTrash size={25} />
                    </ActionIcon>
                </Flex>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            <Flex pl="md" pr="md" justify="space-between" align="center">
                <Box>
                    <h2 style={{ color: '#393939BA' }}>Employee Master</h2>
                </Box>
                <Box>
                    <Flex justify="space-between" gap="10px">
                        <Group>
                            <TextInput
                                w="100%"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                style={{ width: '300px' }} // Adjust width as needed
                            />
                        </Group>
                        <Button onClick={() => { setIsEditing(false); open(); }} bg="#182452">Add Employee</Button>
                        <Button bg="#182452" onClick={() => document.getElementById('fileInput').click()}>Import</Button>
                        {/* Add the hidden file input */}
                        <input
                            type="file"
                            id="fileInput"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </Flex>
                </Box>
            </Flex>
            <Box>
                <Box style={{ height: 'calc(75vh - 10px)', overflowY: 'auto', borderRadius: '2px solid black' }}>
                    <Box style={{
                        backgroundColor: 'white',
                        padding: '10px',
                        margin: '10px',
                    }}>
                        {loading ? (
                            <Flex
                                justify="center"
                                align="center"
                                style={{ height: "calc(100vh - 150px)" }}
                            >
                                <Loader size={50} color="#182452" />
                            </Flex>
                        ) : filteredEmployees.length === 0 ? (
                            <Flex justify="center">
                                <img src={noData} style={{ width: "30%", height: "30%" }} />
                            </Flex>
                        ) : (
                            <Table>
                                <Table.Thead>
                                    <Table.Tr style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>
                                        <Table.Th>Name</Table.Th>
                                        <Table.Th>EmpId</Table.Th>
                                        <Table.Th>Email</Table.Th>
                                        <Table.Th>Phone</Table.Th>
                                        <Table.Th>Designation</Table.Th>
                                        <Table.Th>Role</Table.Th>
                                        <Table.Th>Active</Table.Th>
                                        <Table.Th>Salary</Table.Th>
                                        <Table.Th>H Key</Table.Th>
                                        <Table.Th>Password</Table.Th>
                                        <Table.Th colSpan="2" style={{ textAlign: 'center' }}>Action</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>{rows}</Table.Tbody>
                            </Table>
                        )}
                    </Box>

                    <Modal opened={opened} onClose={close} centered size="75%">
                        <AddEmployee
                            closeModal={close}
                            employeeData={currentEmployee}
                            isEditing={isEditing}
                            onSubmit={fetchData}
                        />
                    </Modal>
                </Box>
                {filteredEmployees.length > 0 && (
                    <Flex justify="center" mt="md">
                        <Pagination page={currentPage} color="#182452" onChange={handlePageChange} total={totalPages} />
                    </Flex>
                )}
            </Box>
        </>
    );
}


