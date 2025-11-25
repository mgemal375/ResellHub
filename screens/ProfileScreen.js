import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { auth, db } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function ProfileScreen({ navigation }) {
  const user = auth.currentUser;
  const [name, setName] = useState("");
  const [email] = useState(user?.email || "");
    const [contact, setContact] = useState(getDoc?.contact || "");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!user) return;
    try {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setName(snap.data().name);
        setContact(snap.data().contact)
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!name) {
      setError("Name cannot be empty");
      return;
    }
    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, { name, contact });
      setError("Profile updated successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    navigation.replace("Login"); 
  };

  if (loading) return <Text style={styles.loading}>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.email}>{email}</Text>
      <Text style={styles.label}>Contact:</Text>
      <Text style={styles.contact}>{contact}</Text>



      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />
      <Text style={styles.label}>Contact:</Text>
      <TextInput
        style={styles.input}
        value={contact}
        onChangeText={setContact}
        placeholder="Enter your contact"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.buttonContainer}>
        <Button title="Update Profile" onPress={updateProfile} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Logout" onPress={logout} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    marginBottom: 15,
  },
  error: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
  loading: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});
