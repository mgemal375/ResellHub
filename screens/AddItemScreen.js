import { Alert, Text, TextInput, TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { firebaseDB, firebaseAuth, storage } from '../config/firebase.js';

export default function AddItemScreen() {
    const [item, setItem] = useState({
        title: '',
        price: '',
        description: ''
    });

    const [image, setImage] = useState(null);


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const uploadImage = async () => {
        if (!image) return null;

        const response = await fetch(image);
        const blob = await response.blob();

        const imageRef = ref(storage, `listingImages/${firebaseAuth.currentUser.uid}/${Date.now()}.jpg`);

        await uploadBytes(imageRef, blob);
        return await getDownloadURL(imageRef);
    };


    const addItem = async () => {
        if (!item.title || !item.price || !item.description) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        try {
            let imageUrl = await uploadImage();

            const newItem = {
                title: item.title,
                price: parseFloat(item.price),
                description: item.description,
                imageUrl: imageUrl || null,
                userId: firebaseAuth.currentUser.uid,
                createdAt: new Date()
            };

            await addDoc(collection(firebaseDB, "Listings"), newItem);

            Alert.alert("Success", "Item added!");

            setItem({ title: "", price: "", description: "" });
            setImage(null);

        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Failed to add item");
        }
    };

    return (
        <View style={styles.container}>

            {image && (
                <Image
                    source={{ uri: image }}
                    style={{ width: "100%", height: 200, marginBottom: 20, borderRadius: 10 }}
                />
            )}

            <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
                <Text style={styles.imageBtnText}>
                    {image ? "Change Image" : "Upload Image"}
                </Text>
            </TouchableOpacity>

            <TextInput
                style={styles.inputStyle}
                value={item.title}
                onChangeText={(text) => setItem({ ...item, title: text })}
                placeholder='Item title'
            />

            <TextInput
                style={styles.inputStyle}
                value={item.price}
                onChangeText={(text) => setItem({ ...item, price: text })}
                placeholder='Price'
                keyboardType='numeric'
            />

            <TextInput
                style={styles.inputStyle}
                value={item.description}
                onChangeText={(text) => setItem({ ...item, description: text })}
                placeholder='Description'
            />

            <TouchableOpacity style={styles.btnStyle} onPress={addItem}>
                <Text style={styles.btnText}>Add Item</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f2f2f2',
    },
    inputStyle: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#fff'
    },
    imageBtn: {
        backgroundColor: "#007bff",
        padding: 12,
        borderRadius: 8,
        marginBottom: 15
    },
    imageBtnText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold"
    },
    btnStyle: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 8,
        marginTop: 10
    },
    btnText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold'
    }
});

