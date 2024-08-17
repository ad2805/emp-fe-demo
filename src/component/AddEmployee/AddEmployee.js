import { useState, useEffect } from 'react';
import { Button, Flex, Text, Box, TextInput, Select } from '@mantine/core';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createEmployee, updateEmployee } from '../../services/Services';
import { Switch, useMantineTheme, rem } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

export default function AddEmployee({ closeModal, employeeData, isEditing, onSubmit }) {
    const [data, setData] = useState({
        name: '',
        empId: '',
        hkey: '',
        email: '',
        phoneNo: '',
        role: '',
        designation: '',
        is_active: 0,
        salary: '',
        password: ''
    });
    const [hierarchyData, setHierarchyData] = useState([]);
    const [designations, setDesignations] = useState([]);
    const roles = ['Admin', 'User']; // Hardcoded roles
    const theme = useMantineTheme();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (isEditing && employeeData) {
            setData({
                ...employeeData,
                is_active: employeeData.is_active ? 1 : 0
            });
            if (employeeData.designation) {
                const selectedHierarchy = hierarchyData.find(item => item.designation === employeeData.designation);
                if (selectedHierarchy) {
                    setData(prevData => ({
                        ...prevData,
                        hkey: selectedHierarchy.hkey
                    }));
                }
            }
        } else {
            // Reset fields if not editing
            setData({
                name: '',
                empId: '',
                hkey: '',
                email: '',
                phoneNo: '',
                role: '',
                designation: '',
                is_active: 0,
                salary: '',
                password: ''
            });
        }
    }, [employeeData, isEditing, hierarchyData]);

    useEffect(() => {
        const fetchHierarchyData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}:${process.env.REACT_APP_PROJECTS_PORT}${process.env.REACT_APP_ADMIN_API_ENDPOINT}/hierarchy/all`);
                const data = await response.json();
                console.log('Fetched data:', data);
                if (data.length > 0 && data[0].Hierarchy_Progression) {
                    const flatHierarchy = data[0].Hierarchy_Progression.reduce((acc, item) => {
                        if (Array.isArray(item.Progression)) {
                            item.Progression.forEach(progress => {
                                Object.keys(progress).forEach(key => {
                                    if (key !== 'name') {
                                        acc.push({ designation: progress[key], hkey: key });
                                    }
                                });
                            });
                        } else {
                            Object.keys(item.Progression).forEach(key => {
                                if (key !== 'name') {
                                    acc.push({ designation: item.Progression[key], hkey: key });
                                }
                            });
                        }
                        return acc;
                    }, []);
                    setHierarchyData(flatHierarchy);
                    setDesignations(flatHierarchy.map(item => item.designation));
                }
            } catch (error) {
                console.error('Error fetching hierarchy data:', error);
            }
        };

        fetchHierarchyData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSelectChange = (name, value) => {
        setData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDesignationChange = (value) => {
        const selectedDesignation = hierarchyData.find(item => item.designation === value);
        setData(prevState => ({
            ...prevState,
            designation: value,
            hkey: selectedDesignation ? selectedDesignation.hkey : ''
        }));
    };

    const handleSwitchChange = (checked) => {
        setChecked(checked);
        setData(prevState => ({
            ...prevState,
            is_active: checked ? 1 : 0
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting data:', data);  // Log the data being submitted

        try {
            if (isEditing) {
                const { _id, ...updatedData } = data;
                console.log('Updating employee with email:', data.empId);  // Log the email
                await updateEmployee(data.empId, updatedData);
                toast.success('Employee updated successfully');
            } else {
                await createEmployee(data);
                toast.success('Employee added successfully');
            }

            setTimeout(() => {
                closeModal();
                if (onSubmit) onSubmit();
            }, 1000);
        } catch (error) {
            console.error('Error saving employee:', error);
            toast.error('Failed to save employee');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Text w="100%" align="center" fw="bold" c="#3E3E3E" size="18px" mb="10px">
                {isEditing ? 'Edit Employee' : 'Add Employee'}
            </Text>
            <Flex direction="column">
                <Flex justify="space-around">
                    <Box w="30%">
                        <TextInput
                            mt="xs"
                            required
                            label="Name"
                            placeholder="Name"
                            name="name"
                            value={data.name}
                            onChange={handleInputChange}
                        />
                    </Box>
                    <Box w="30%">
                        <TextInput
                            mt="xs"
                            required
                            label="empId"
                            placeholder="empId"
                            name="empId"
                            value={data.empId}
                            onChange={handleInputChange}
                        />
                    </Box>
                    <Box w="30%">
                        <TextInput
                            mt="xs"
                            required
                            label="Email"
                            placeholder="Email"
                            name="email"
                            value={data.email}
                            onChange={handleInputChange}
                        />
                    </Box>
                </Flex>

                <Flex align="center" justify="space-around" mt="lg">
                    <Box w="30%">
                        <TextInput
                            mt="xs"
                            required
                            label="Phone Number"
                            placeholder="Phone Number"
                            name="phoneNo"
                            type="number" // Set type to number
                            value={data.phoneNo}
                            onChange={handleInputChange}
                        />
                    </Box>
                    <Box w="30%">
                        <Select
                            mt="xs"
                            required
                            label="Role"
                            placeholder="Role"
                            name="role"
                            data={roles}
                            value={data.role}
                            onChange={(value) => handleSelectChange('role', value)}
                        />
                    </Box>
                    <Box w="30%">
                        <Select
                            mt="xs"
                            required
                            label="Designation"
                            placeholder="Designation"
                            name="designation"
                            data={designations}
                            value={data.designation}
                            onChange={handleDesignationChange}
                        />
                    </Box>
                </Flex>

                <Flex align="center" justify="space-around" mt="lg">
                    <Box w="30%">
                        <TextInput
                            mt="xs"
                            required
                            label="Salary"
                            placeholder="Salary"
                            name="salary"
                            type="number" // Set type to number
                            value={data.salary}
                            onChange={handleInputChange}
                        />
                    </Box>

                    <Box w="30%">
                        <TextInput
                            mt="xs"
                            required
                            label="H Key"
                            placeholder="H Key"
                            name="hkey"
                            type="number" // Set type to number
                            value={data.hkey}
                            readOnly // Make the input read-only
                        />
                    </Box>
                    <Box w="30%">
                        <TextInput
                            mt="xs"
                            required
                            label="Password"
                            placeholder="Password"
                            name="password"
                            type="password" // Set type to password
                            value={data.password}
                            onChange={handleInputChange}
                        />
                    </Box>
                </Flex>
                <Flex align="center" justify="space-around" mt="lg">
                   
                    <Box w="30%">
                        <Switch
                            pl="40px"
                            pt="38px"
                            size="lg"
                            checked={data.is_active === 1}
                            onChange={(event) => handleSwitchChange(event.currentTarget.checked)}
                            color="teal"
                            // size="md"
                            label="Active"
                            thumbIcon={
                                data.is_active === 1 ? (
                                    <IconCheck
                                        style={{ width: rem(12), height: rem(12) }}
                                        color={theme.colors.teal[6]}
                                        stroke={3}
                                    />
                                ) : (
                                    <IconX
                                        style={{ width: rem(12), height: rem(12) }}
                                        color={theme.colors.red[6]}
                                        stroke={3}
                                    />
                                )
                            }
                        />
                    </Box>
                </Flex>

                <Box align="center">
                    <Button
                        mt="xl"
                        bg="#182452"
                        w="20%"
                        type="submit"
                    >
                        Save
                    </Button>
                </Box>
            </Flex>
        </form>
    );
}

