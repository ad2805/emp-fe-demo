import React, { useState, useEffect } from "react";
import {
  Box,
  Divider,
  Flex,
  Paper,
  Text,
  Modal,
  Input,
  Button,
  Select,
  Loader,
  ScrollArea,
} from "@mantine/core";
import {
  IconEdit,
  IconPlus,
  IconTrash,
  IconChevronDown,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";


export default function AddHierarchy() {
 

  return (
    <div>
      <Flex justify="space-between" align="center" mr="50px" ml="lg" mt="lg">
        <Text c={"#393939BA"} fw={"bold"} size="20px">
          Add / Edit Hierarchy
        </Text>
      </Flex>
      <ScrollArea h={"calc(100vh - 65px)"} type="never" pt="md">
        <Paper
          bg="#FFFFFF"
          mt="lg"
          mr="sm"
          ml="sm"
          p="lg"
          x
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
        >
            <Link to="/hierarchy">
            <Button bg="#182452" mb="md">
            Back
          </Button>
            </Link>
        
          <Divider mx="md" />
          <Flex>
            <Box w="30%" mt="69px" mx="lg">
              <Box
                bg="#00000008"
                style={{
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  borderRadius: 5,
                }}
              >
                <Flex justify="space-between" p="lg" align="center">
                  <Text c="#393939BA" fw="bold" size="18px">
                    Type
                  </Text>
                  <IconPlus
                    style={{
                      cursor: "pointer",
                      width: 30,
                      height: 30,
                    }}
                   
                    color="#393939BA"
                  />
                </Flex>
                <Paper bg="#FFFFF" p="lg">
                    <Flex
                     
                      align="center"
                      mb="sm"
                      justify="space-between"
                    >
                      <Text c="#393939BA" fw="bold">
                        Enginering
                      </Text>
                      <Flex gap="lg">
                        <IconEdit
                          color="#393939BA"
                        
                          style={{ cursor: "pointer", marginLeft: "auto" }}
                        />
                        <IconTrash
                       
                          color="#393939BA"
                          style={{ cursor: "pointer" }}
                        />
                      </Flex>
                    </Flex>
                </Paper>
              </Box>
            </Box>
            <Divider orientation="vertical" />
            <Box w="70%" mt="md">
              <Flex justify="space-around" w="100%" px="lg" gap="md">
                <Select
                  placeholder="Select Type"
                 
                  rightSection={<IconChevronDown />}
                 
                />
                <Select
                  placeholder="Choose Management"
                 
                  rightSection={<IconChevronDown />}
                 
                />
              </Flex>
              <Flex>
                <Box
                  w="50%"
                  mt="md"
                  mx="lg"
                  bg="#00000008"
                  style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: 5,
                  }}
                >
                  <Flex justify="space-between" p="lg" align="center">
                    <Text c="#393939BA" fw="bold" size="18px">
                      H Key
                    </Text>
                    <IconPlus
                      style={{
                        cursor: "pointer",
                        width: 30,
                        height: 30,
                      }}
                      color="#393939BA"
                   
                    />
                  </Flex>
                  <Paper bg="#FFFFFF" p="lg">
                   
                        <Flex
                         
                          align="center"
                          mb="sm"
                          justify="space-between"
                        >
                          <Text c="#393939BA" fw="bold">
                        Key Number
                          </Text>
                          <Flex gap="lg">
                            <IconEdit
                              color="#393939BA"
                              style={{ cursor: "pointer", marginLeft: "auto" }}
                         
                            />
                            <IconTrash
                              color="#393939BA"
                              style={{ cursor: "pointer" }}
                             
                            />
                          </Flex>
                        </Flex>
                 
                  </Paper>
                </Box>
                <Divider orientation="vertical" />
                <Box w="50%">
                  <Box
                    mt="md"
                    mx="lg"
                    bg="#00000008"
                    style={{
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      borderRadius: 5,
                    }}
                  >
                    <Flex justify="space-between" p="lg" align="center">
                      <Text c="#393939BA" fw="bold" size="18px">
                       Designation
                      </Text>
                      <IconPlus
                        style={{
                          cursor: "pointer",
                          width: 30,
                          height: 30,
                        }}
                        color="#393939BA"
                      />
                    </Flex>
                    <Paper bg="#FFFFF" p="lg">
                     
                          <Flex
                            justify="space-between"
                            mb="sm"
                          >
                            <Text c="#393939BA" fw="bold">Designation Name</Text>
                            <Flex gap="lg">
                              <IconEdit
                                color="#393939BA"
                                style={{
                                  cursor: "pointer",
                                  marginLeft: "auto",
                                }}
                             
                              />
                              <IconTrash
                                color="#393939BA"
                                style={{ cursor: "pointer" }}
                               
                              />
                            </Flex>
                          </Flex>
                     
                    </Paper>
                  </Box>
                </Box>
              </Flex>
            </Box>
          </Flex>
          <Divider mt="lg" size="3px" mx="lg" />
          <Flex>
            <Box w="50%">
              <Box
                mt="md"
                mx="lg"
                bg="#00000008"
                style={{
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  borderRadius: 5,
                }}
              >
              </Box>
            </Box>
            <Divider orientation="vertical" mt="md" />
            <Box w="50%">
              <Box
                mt="md"
                mx="lg"
                bg="#00000008"
                style={{
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  borderRadius: 5,
                }}
              >
              </Box>
            </Box>
          </Flex>
        </Paper>
      </ScrollArea>
    </div>
  );
}
