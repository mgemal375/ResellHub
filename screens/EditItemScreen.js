import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseAuth, firebaseDB, firebaseStorage } from '../config/firebase';

export default function EditItemScreen({ route, navigation }) {
    const { item } = route.params; 

    const [updatedItem, setUpdatedItem] = useState({
        title: item.title,
        price: item.price.toString(),
        description: item.description,
    });


    
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    
    const uploadImageAsync = async (uri) => {
        if (!uri) return null;

        const response = await fetch(uri);
        const blob = await response.blob();

        const filename = `${firebaseAuth.currentUser.uid}_${Date.now()}`;
        const storageRef = ref(firebaseStorage, `listingImages/${filename}`);

        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    };

    const saveChanges = async () => {
        if (!updatedItem.title || !updatedItem.price || !updatedItem.description) {
            return Alert.alert("Error", "Please fill all fields");
        }

        try {
            let imageUrl = image;

           
            if (image !== item.imageUrl) {
                imageUrl = await uploadImageAsync(image);
            }

            const itemRef = doc(firebaseDB, "Listings", item.id);

            await updateDoc(itemRef, {
                title: updatedItem.title,
                price: parseFloat(updatedItem.price),
                description: updatedItem.description,
                imageUrl: imageUrl,
            });

            Alert.alert("Success", "Item updated!");
            navigation.goBack();

        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Failed to update item");
        }
    };

    return (
        <View style={styles.container}>
            {image && (
                <Image
                    source={{ uri: image }}
                    style={{ width: "100%", height: 200, borderRadius: 8, marginBottom: 15 }}
                />
            )}

            <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
                <Text style={styles.btnText}>
                    {image ? "Change Image" : "Upload Image"}
                </Text>
            </TouchableOpacity>

            <TextInput
                style={styles.inputStyle}
                value={updatedItem.title}
                onChangeText={(text) => setUpdatedItem({ ...updatedItem, title: text })}
                placeholder='Item title'
            />

            <TextInput
                style={styles.inputStyle}
                value={updatedItem.price}
                onChangeText={(text) => setUpdatedItem({ ...updatedItem, price: text })}
                placeholder='Price'
                keyboardType='numeric'
            />

            <TextInput
                style={styles.inputStyle}
                value={updatedItem.description}
                onChangeText={(text) => setUpdatedItem({ ...updatedItem, description: text })}
                placeholder='Description'
            />

            <TouchableOpacity style={styles.btnStyle} onPress={saveChanges}>
                <Text style={styles.btnText}>Save Changes</Text>
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
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
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

