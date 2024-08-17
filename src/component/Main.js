import { useState } from 'react';
import {
    Group,
    Box,
    TextInput,
    Text,
    Center,
    Flex,
} from "@mantine/core";
import classes from "./HeaderMegaMenu.module.css";
import { IconUserCircle } from "@tabler/icons-react";
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import EmployeeMaster from "./EmployeeMaster/EmployeeMaster";
import Logo from "../assets/logo.png";
import EmployeeHistory from "./EmployeeHistory/EMployeeHistory";
import HierarchyEmployee from './HierarchyMap/HierarchyEmployee';
import AddHierarchy from './HierarchyMap/addHierarchy/AddHierarchy';

function Header() {
    const location = useLocation();
    const currentPath = location.pathname;

    const linkStyles = (path) => ({
        backgroundColor: currentPath === path ? '#182452' : 'transparent',
        color: currentPath === path ? 'white' : 'black',
        borderRadius: '5px',
        border: currentPath === path ? '2px solid #182452' : '2px solid transparent',
        padding: '5px 10px',
        textDecoration: 'none',
    });

    return (
        <header className={classes.header} style={{ backgroundColor: 'white', position: 'sticky', top: 0, zIndex: 1 }}>
            <Group justify="space-between" h="100%">
                <Group>
                <Flex to="/" justify="space-between" align="center" gap="10px" style={{ textDecoration: 'none' }}>
                                <img src={Logo} alt="Logo" style={{ width: 40, height: 40 }} />
                                <Text fw="bold" size="20px">EMPM</Text>
                            </Flex>
                </Group>

              
                <Group>
                    <Link to="/employee" style={linkStyles('/employee')}>
                        <Center inline>
                            <Box component="span" mr={5}>
                                Employee
                            </Box>
                        </Center>
                    </Link>
                    <Link to="/history" style={linkStyles('/history')}>
                        <Center inline>
                            <Box component="span" mr={5}>
                                History
                            </Box>
                        </Center>
                    </Link>
                    <Link to="/hierarchy" style={linkStyles('/hierarchy')}>
                        <Center inline>
                            <Box component="span" mr={5}>
                                Hierarchy
                            </Box>
                        </Center>
                    </Link>
                </Group>
                <Group visibleFrom="sm">
                    <IconUserCircle size="30px" />
                </Group>
            </Group>
        </header>
    );
}

export default function Main() {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <BrowserRouter>
            <Box style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Header searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
                <Box style={{ flex: 1, overflowY: 'auto' }}>
                    <Routes>
                        <Route path="/employee" element={<EmployeeMaster/>} />
                        <Route path="/history" element={<EmployeeHistory />} />
                        <Route path="/hierarchy" element={<HierarchyEmployee />} />
                        <Route path="/" element={<EmployeeMaster />} />
                        <Route path='/addhierarchy' element={<AddHierarchy />} />
                    </Routes>
                </Box>
            </Box>
        </BrowserRouter>
    );
}
