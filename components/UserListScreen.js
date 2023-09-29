import { useState, useEffect } from "react";

import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import axios from "axios";
import { Image } from "expo-image";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export function UserListScreen() {
  console.log("render UserListScreen()");
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");

  const displayData = data.filter(
    (item) =>
      item.name.first.toLowerCase().includes(searchText.toLowerCase()) ||
      item.name.last.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await axios.get(
          "https://randomuser.me/api/?results=20"
        );

        for (let i = 0; i < data.results.length; i++) {
          data.results[i].uuid = uuidv4();
        }

        setData(data.results);
      } catch (error) {
        console.log(error);
      }
    }

    loadData();
  }, []);

  return (
    <View
      style={{
        width: "100%",

        height: "100%"
      }}
    >
      <View style={{ flex: 7 }}>
        <FlatList
          data={displayData}
          keyExtractor={(item) => item.uuid}
          renderItem={({ item }) => {
            return (
              <View style={{ flexDirection: "row", padding: 5 }}>
                <Image
                  source={item.picture.thumbnail}
                  style={{
                    width: 48,
                    height: 48,
                    marginRight: 5,
                    borderRadius: 10
                  }}
                />
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",

                    width: "80%"
                  }}
                >
                  <Text>
                    {item.name.first} {item.name.last}
                  </Text>

                  <Text>{item.email}</Text>
                </View>
              </View>
            );
          }}
        />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 25}
        style={{
          flex: 1,
          backgroundColor: "#ddd",
          alignItems: "center"
        }}
      >
        <TextInput
          value={searchText}
          placeholder="Enter search"
          onChangeText={(input) => {
            console.log(input);
            setSearchText(input);
          }}
          autoCorrect={false}
          autoComplete="off"
          style={{
            borderWidth: 1,
            padding: 10,
            fontSize: 24,
            width: "80%",
            borderRadius: 8,
            borderColor: "#ccc",
            marginTop: 6,
            backgroundColor: "white"
          }}
        />
      </KeyboardAvoidingView>
    </View>
  );
}
