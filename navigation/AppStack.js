import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/ProfileScreen";
import AddItemScreen from "../screens/AddItemScreen";
import EditItemScreen from "../screens/EditItemScreen";
import HomeScreen from "../screens/HomeScreen";


const Stack = createNativeStackNavigator();

export default function AppStack({initialRouteName}) {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRouteName}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="AddItem" component={AddItemScreen} />
      <Stack.Screen name="EditItem" component={EditItemScreen} />
       <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
