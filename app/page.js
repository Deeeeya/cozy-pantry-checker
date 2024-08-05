"use client"; // makes this a client sided page
//import necessary things for ur page
import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Modal,
  Typography,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  getDoc,
  setDoc,
} from "firebase/firestore";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]); //state variable to store inventory
  const [open, setOpen] = useState(false); //default value will be false //this is going to be used to add and remove stuff
  const [itemName, setItemName] = useState(""); //this item name will be used to store the name of the item we type out
  const [selectedCategories, setSelectedCategories] = useState("");
  //we use async because it wont block code when fetching
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory")); //will get snapshots of the collection by doing a query from Firebase
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const getCategories = async () => {
    const snapshot = query(collection(firestore, "categories")); //will get snapshots of the collection by doing a query from Firebase
    const docs = await getDocs(snapshot);
    const categoriesList = [];
    docs.forEach((doc) => {
      categoriesList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setCategories(categoriesList);
  };
  useEffect(() => {
    getCategories();
  }, []);

  const handleChange = (event) => {
    setSelectedCategories(event.target.value);
  };

  //create helper function that will let us add items
  const addItem = async (itemName, category) => {
    const docRef = doc(collection(firestore, "inventory"), itemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 }, { merge: true });
    } else {
      await setDoc(docRef, { quantity: 1, category: category });
    }

    await updateInventory();
  };

  //create helper function that will let us remove items
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  const filteredItems = React.useMemo(() => {
    if (!searchQuery) return inventory;

    return inventory.filter((item) =>
      item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, inventory]);

  //useeffect runs the code above,
  useEffect(() => {
    updateInventory();
  }, [searchQuery]);

  //model helper functions
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Vegetable":
        return (
          <Image
            src="/vegetables_498229.png"
            width={50}
            height={50}
            objectFit="contain"
            alt="category"
          />
        );
        break;

      case "Fruit":
        return (
          <Image
            src="/strawberry_13643533.png"
            width={50}
            height={50}
            objectFit="contain"
            alt="category"
          />
        );
        break;

      case "Beverages":
        return (
          <Image
            src="/drinks_3050153.png"
            width={50}
            height={50}
            objectFit="contain"
            alt="category"
          />
        );
        break;

      case "Dairy":
        return (
          <Image
            src="/dairy-products_2137730.png"
            width={50}
            height={50}
            objectFit="contain"
            alt="category"
          />
        );
        break;

      case "Grain":
        return (
          <Image
            src="/sack_8555049.png"
            width={50}
            height={50}
            objectFit="contain"
            alt="category"
          />
        );
        break;

      case "Protein":
        return (
          <Image
            src="/protein_2843659.png"
            width={50}
            height={50}
            objectFit="contain"
            alt="category"
          />
        );
        break;

      case "Snacks":
        return (
          <Image
            src="/snacks_2832798.png"
            width={50}
            height={50}
            objectFit="contain"
            alt="category"
          />
        );
        break;

      default:
        return (
          <Image
            src="/snacks_2832798.png"
            width={50}
            height={50}
            objectFit="contain"
            alt="category"
          />
        );
        break;
    }
  };

  return (
    <div>
      <div className="navbar">
        <div className="logostick">
          <h1 class="cozy-pantry">My Cozy Pantry</h1>
          <Image
            className="grocery-bag"
            src="/grocery-bag (1).png"
            alt="pantry"
            width={50} // specify width
            height={50} // specify height
          />
        </div>
        <div>
          <input
            className="searchBar"
            placeholder="Search items"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="inventory-page">
        <Button
          variant="text"
          position="absolute"
          onClick={() => {
            handleOpen();
          }}
        >
          <div className="addItemBox">
            <p className="addItemBtn">Add New Item</p>
          </div>
        </Button>
        <div className="modalContainer">
          <Modal className="addItemModal" open={open} onClose={handleClose}>
            <Box
              className="addItemModal"
              position="absolute"
              top="50%"
              left="50%"
              width={400}
              bgcolor="#f2bc79"
              boxShadow={24}
              p={4}
              display="flex"
              flexDirection="column"
              gap={3}
              sx={{
                transform: "translate(-50%,-50%)",
              }}
            >
              <Typography variant="h6" margin-bottom="100px">
                Add Item
              </Typography>
              <Stack width="100%" direction="column" display="flex" spacing={2}>
                <div className="inputContainer">
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={itemName}
                    onChange={(e) => {
                      setItemName(e.target.value);
                    }}
                  />
                  {/* Category Dropdown */}
                  <Box sx={{ minWidth: 120, paddingLeft: 1 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Category
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedCategories}
                        label="Category"
                        onChange={handleChange}
                      >
                        {categories.map((category, index) => (
                          <MenuItem key={index} value={category.name}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </div>
                <Button
                  className="addButton"
                  variant="outlined"
                  onClick={() => {
                    addItem(itemName, selectedCategories);
                    setItemName("");
                    handleClose();
                  }}
                >
                  Add
                </Button>
              </Stack>
            </Box>
          </Modal>
        </div>
        <div className="center-content">
          <div className="head-tag">
            <p>Inventory Items</p>
          </div>
          <div className="items-container">
            {filteredItems.map(({ name, quantity, category }) => (
              <div className="item-card" key={name}>
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {getCategoryIcon(category)}
                  <div>
                    <p class="item-name">Item Name</p>
                    <Typography variant="h4" color="#d9d9d9" textAlign="center">
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Typography>
                  </div>
                </div>
                <div className="quantity-control">
                  <Button
                    variant="text"
                    borderRadius="100%"
                    onClick={() => addItem(name)}
                  >
                    <p class="btn">+</p>
                  </Button>
                  <Typography
                    variant="h4"
                    color="#d9d9d9"
                    textAlign="center"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {quantity}
                  </Typography>
                  <Button variant="text" onClick={() => removeItem(name)}>
                    <p class="btn">-</p>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
// <Button
//   variant="contained"
//   onClick={() => {
//     handleOpen();
//   }}
// >
//   Add New Item
// </Button>
