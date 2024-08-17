import React, { useState, useEffect } from "react";
import {
    Select,
    Box,
    Text,
    Flex,
    Paper,
    Input,
    Table,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import TreeChart from "./HierarchyMapChart/HierarchyChart";

export default function HierarchyEmployee() {
    const [hierarchyData, setHierarchyData] = useState([]);
    const [hierarchyTypes, setHierarchyTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [managementNames, setManagementNames] = useState([]);
    const [selectedManagement, setSelectedManagement] = useState('');
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchHierarchyData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}:${process.env.REACT_APP_PROJECTS_PORT}${process.env.REACT_APP_ADMIN_API_ENDPOINT}/hierarchy/all`);
                const data = await response.json();
                console.log('Fetched data:', data);
                if (data.length > 0 && data[0].Hierarchy_Progression) {
                    setHierarchyData(data[0].Hierarchy_Progression);
                    const types = data[0].Hierarchy_Progression.map(item => item.Type);
                    setHierarchyTypes(types);
                }
            } catch (error) {
                console.error('Error fetching hierarchy data:', error);
            }
        };

        fetchHierarchyData();
    }, []);

    useEffect(() => {
        if (selectedType === 'Management') {
            const managementData = hierarchyData.find(item => item.Type === 'Management');
            if (managementData) {
                const names = managementData.Progression.map(item => item.name);
                setManagementNames(names);
            }
        }
    }, [selectedType, hierarchyData]);

    useEffect(() => {
        const transformData = (data) => {
            const root = {
                name: 'IGS',
                children: []
            };

            data.forEach((item) => {
                const { Type, Progression } = item;

                if (Type === 'Engineering') {
                    const engineering = {
                        name: 'Engineering',
                        children: Object.keys(Progression).map((key) => ({
                            name: Progression[key],
                            value: Number(key)
                        }))
                    };
                    root.children.push(engineering);
                } else if (Type === 'Management') {
                    const management = {
                        name: 'Management',
                        children: Progression.map((subType) => ({
                            name: subType.name,
                            children: Object.keys(subType).filter(key => key !== 'name').map((key) => ({
                                name: subType[key],
                                value: Number(key)
                            }))
                        }))
                    };
                    root.children.push(management);
                }
            });

            return root;
        };

        const getFilteredChartData = () => {
            if (!selectedType) {
                return transformData(hierarchyData);
            }

            const filteredData = hierarchyData.filter(item => item.Type === selectedType);
            return transformData(filteredData);
        };

        setChartData(getFilteredChartData());
    }, [selectedType, selectedManagement, hierarchyData]);

    const renderTableRows = (progression) => {
        return Object.keys(progression).map(key => (
            <Table.Tr key={key}>
                <Table.Td>{key}</Table.Td>
                <Table.Td>{progression[key]}</Table.Td>
            </Table.Tr>
        ));
    };

    const renderTable = () => {
        if (selectedType === 'Engineering') {
            const engineeringData = hierarchyData.find(item => item.Type === 'Engineering');
            if (engineeringData) {
                return (
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th style={{ textAlign: 'center' }}>Level</Table.Th>
                                <Table.Th style={{ textAlign: 'center' }}>Designation</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody style={{ textAlign: 'center' }}>{renderTableRows(engineeringData.Progression)}</Table.Tbody>
                    </Table>
                );
            }
        } else if (selectedType === 'Management' && selectedManagement) {
            const managementData = hierarchyData.find(item => item.Type === 'Management');
            if (managementData) {
                const selectedManagementData = managementData.Progression.find(item => item.name === selectedManagement);
                if (selectedManagementData) {
                    return (
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th style={{ textAlign: 'center' }}>Level</Table.Th>
                                    <Table.Th style={{ textAlign: 'center' }}>Designation</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody style={{ textAlign: 'center' }}>{renderTableRows(selectedManagementData)}</Table.Tbody>
                        </Table>
                    );
                }
            }
        }
        return null;
    };

    return (
        <Box>
            <Flex justify="space-between" align="center" mr="50px" ml="md" m="md" p="md">
                <Text c={"#393939BA"} fw={"bold"} size="20px">
                    Hierarchy Map
                </Text>
                {/* <Input
                    placeholder="Search Designation"
                /> */}
            </Flex>
            <Flex justify="space-between" h="75vh">
                <Paper
                    w="38%"
                    bg="#FFFFFF"
                    mr="sm"
                    ml="sm"
                    p="lg"
                    style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                >
                    <Flex mb="md" justify="space-between">
                        <Text fw="bold" size="16px">
                            Hierarchy Table
                        </Text>
                    </Flex>
                    <Box mb="lg">
                        <Flex justify="space-around">
                            <Select
                                placeholder="Select Type"
                                rightSection={<IconChevronDown />}
                                data={hierarchyTypes}
                                value={selectedType}
                                onChange={(value) => {
                                    setSelectedType(value);
                                    setSelectedManagement('');
                                }}
                            />
                            {selectedType === 'Management' && (
                                <Select
                                    placeholder="Select Management"
                                    rightSection={<IconChevronDown />}
                                    data={managementNames}
                                    value={selectedManagement}
                                    onChange={setSelectedManagement}
                                />
                            )}
                        </Flex>
                    </Box>
                    {renderTable()}
                </Paper>
                <Paper
                    w="62%"
                    bg="#FFFFFF"
                    mr="sm"
                    ml="sm"
                    p="lg"
                    style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                >
                    <Flex mb="md" justify="space-between">
                        <Text fw="bold" size="16px">
                            Hierarchy Charts
                        </Text>
                    </Flex>
                    <Box style={{ width: '100%', height: '100%' }}>
                        <TreeChart chartData={chartData} />
                    </Box>
                </Paper>
            </Flex>
        </Box>
    );
}

