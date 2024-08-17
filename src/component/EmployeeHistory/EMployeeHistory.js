import React, { useState, useEffect } from 'react';
import { Table, Pagination, Modal, Text, Button, Flex, Box, ActionIcon, Loader, TextInput, Group, Badge } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconTrash, IconUser, IconUserCog } from '@tabler/icons-react';
import { deleteAllEmployees } from '../../services/Services';
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

export default function EmployeeHistory() {
    const [employees, setEmployees] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(15);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}:${process.env.REACT_APP_PROJECTS_PORT}${process.env.REACT_APP_ADMIN_API_ENDPOINT}/employee/history`);
            const data = await response.json();
            const employeeArray = Array.isArray(data) ? data : [data];
            setEmployees(employeeArray);
            setTotalPages(Math.ceil(employeeArray.length / itemsPerPage));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset to the first page after searching
    };

    const handleDeleteAll = async () => {
        try {
            await deleteAllEmployees();
            setEmployees([]);
            closeDeleteModal();
        } catch (error) {
            console.error('Error deleting all employees:', error);
        }
    };

    const removeEmployee = async (empId) => {
        try {
            await fetch(`${process.env.REACT_APP_API_BASE_URL}:${process.env.REACT_APP_PROJECTS_PORT}${process.env.REACT_APP_ADMIN_API_ENDPOINT}/employee/deleteSinglehistory/${empId}`, {
                method: 'DELETE'
            });
            toast.success('Employee removed successfully');
            fetchData();
        } catch (error) {
            toast.error('Failed to remove employee');
            console.error('Error removing employee:', error);
        }
    };

       // Function to format numbers in Indian numbering system
       const formatSalary = (salary) => {
        return salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace(/(\d+)(\d{2},)/, "$1,$2");
    };

    const filteredEmployees = employees.filter(employee => 
        (employee.name?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (employee.empId?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (employee.email?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (employee.phoneNo?.toString().includes(searchQuery) || '') ||
        (employee.designation?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (employee.role?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
        (employee.salary?.toString().includes(searchQuery) || '')
    );

    const currentEmployees = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const rows = currentEmployees.map((employee) => (
        <Table.Tr key={employee._id}>
            <Table.Td>{employee.name}</Table.Td>
            <Table.Td>{employee.empId}</Table.Td>
            <Table.Td>{employee.email}</Table.Td>
            <Table.Td>{employee.phoneNo}</Table.Td>
            <Table.Td>{employee.designation}</Table.Td>
            <Table.Td>  {employee.role === "Admin" ? (
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
            <Table.Td>
                <ActionIcon onClick={() => removeEmployee(employee.empId)} c="#182452" bg="#ffffff">
                    <IconTrash size={25} />
                </ActionIcon>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            <Flex pl="md" pr="md" justify="space-between" align="center">
                <Box>
                    <h2 style={{ color: '#393939BA' }}>Employee History</h2>
                </Box>
                <Box>
                    <Flex justify="space-between" gap="10px">
                        <Group>
                            <TextInput
                                w="100%"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                style={{ width: '300px' }}
                            />
                        </Group>
                        <Button bg="#182452" onClick={openDeleteModal}>Delete History</Button>
                    </Flex>
                </Box>
            </Flex>
            <Box>
                <Box style={{ height: 'calc(75vh - 10px)', overflowY: 'auto' }}>
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
                        ) : (
                            employees.length === 0 ? (
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
                                            <Table.Th>Action</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>{rows}</Table.Tbody>
                                </Table>
                            )
                        )}
                    </Box>
                </Box>
                <Flex justify="center" mt="md">
                    <Pagination 
                        page={currentPage} 
                        color="#182452" 
                        onChange={setCurrentPage} 
                        total={totalPages} 
                    />
                </Flex>
            </Box>

            <Modal
                opened={deleteModalOpened}
                onClose={closeDeleteModal}
                title={<Text fw="bold" size="18px">Confirm Deletion</Text>}
                centered
            >
                <Text>Are you sure you want to delete all employee data?</Text>
                <Flex justify="flex-end" mt="md">
                    <Button variant="outline" onClick={closeDeleteModal} mr="sm">Cancel</Button>
                    <Button bg="#182452" onClick={handleDeleteAll}>Delete</Button>
                </Flex>
            </Modal>
        </>
    );
}

