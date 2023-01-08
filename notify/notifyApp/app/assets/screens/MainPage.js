import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { Component } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      day: "",
      month: "",
    };
  }

  async submit() {
    let err = false;

    if (
      this.state.day === "" ||
      this.state.month === "" ||
      Number(this.state.month) > 12 ||
      Number(this.state.day) > 31
    ) {
      showAlert("Invalid Day or Month", "The entered day or month is invalid");
      err = true;
      console.log("lol  :: " + this.datesArray()[0]);
      // await AsyncStorage.removeItem("dates");
    }

    if (err != true) {
      console.log("success");

      try {
        // await AsyncStorage.removeItem(dates);
        let dates = await AsyncStorage.getItem("dates");
        console.log(typeof dates);
        console.log(dates);
        // check if the dates array exists
        if (dates == null) {
          // if it doesn't exist, create an empty array
          dates = [];
        } else {
          console.log(dates);
          // if it does exist, parse the dates string as JSON to convert it to an array
          dates = JSON.parse(dates);
        }
        // add the new date to the array
        dates.push(this.state.day + "-" + this.state.month);
        // store the updated array in AsyncStorage
        await AsyncStorage.setItem("dates", JSON.stringify(dates));
        // retrieve the updated array from AsyncStorage
        let d = await AsyncStorage.getItem("dates");
        d = JSON.parse(d);
      } catch (error) {
        console.error(error);
      }
    }
  }

  remainingDate(d) {
    let currentTime = new Date();
    let year = new Date().getFullYear();
    year++;
    let target = new Date();
    target.setTime(year, Number(d.split("-")[1]), Number(d.split("-")[0]));

    let currTime = currentTime.getTime();
    let targetTime = target.getTime();

    let totalMilSec = targetTime - currTime;
    let daysBetweenDates = totalMilSec / 86400000;
    let rem = 365 - daysBetweenDates;
    return String(rem);
  }

  async datesArray() {
    let dates = await AsyncStorage.getItem("dates");
    console.log(dates);
    if (dates == null) {
      dates = [];
      return dates;
    } else {
      try {
        dates = JSON.parse(dates);
      } catch (e) {
        console.log("Error parsing");
        console.log(e);
      }
    }

    console.log(dates);

    const dateElements = dates.map((date) => (
      <View style={styles.addedDate}>
        <View style={styles.dateSec}>
          <Text style={styles.dates}>{date.split("-").join("/")}</Text>
        </View>
        <View style={styles.remDateSec}>
          <Text style={styles.remDate}>{this.remainingDate(date)}</Text>
        </View>
        <View style={styles.closeSec}>
          <Icon name="close" size={30} color="#FF0000" />
        </View>
      </View>
    ));
    console.log(dateElements);
    return dateElements;
  }

  render() {
    // the returning values are obj of promise so figure it out
    const idk =  await this.datesArray();
    console.log("bruh : " + idk[0]);
    return (
      <SafeAreaView style={styles.background}>
        <View style={styles.addSection}>
          <View style={styles.addHeader}>
            <Text style={styles.header}>
              Add the month and date for reminding every year
            </Text>
          </View>
          <View style={styles.inputs}>
            <TextInput
              style={styles.day}
              placeholder="Day"
              maxLength={2}
              keyboardType="phone-pad"
              placeholderTextColor="#6B728E"
              onChangeText={(text) => {
                this.setState({ day: text });
              }}
            />
            <TextInput
              style={styles.mon}
              placeholder="Month"
              maxLength={2}
              keyboardType="phone-pad"
              placeholderTextColor="#6B728E"
              onChangeText={(text) => {
                this.setState({ month: text });
              }}
            />
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                this.submit();
              }}
            >
              <Text style={{ color: "black" }}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.addedSection}>
          <ScrollView style={styles.scrollSec}>
            <View>{idk}</View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#FF8DC7",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  addSection: {
    width: "80%",
    height: "10%",
    backgroundColor: "#9F73AB",
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
  },

  addedSection: {
    width: "80%",
    height: "50%",
    backgroundColor: "#624F82",
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
  },

  scrollSec: {
    backgroundColor: "#FF8DC7",
    width: "100%",
    opacity: 0.5,
  },

  addedDate: {
    width: "95%",
    height: 50,
    marginTop: 10,
    backgroundColor: "#282A3A",
    marginRight: 7,
    marginLeft: 7,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    flexDirection: "row",
  },

  dateSec: {
    height: "90%",
    alignItems: "center",
    flex: 5,
    flexDirection: "row",
  },

  dates: {
    color: "#00E7FF",
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 20,
  },

  remDateSec: {
    height: "90%",
    backgroundColor: "#00E7FF",
    justifyContent: "center",
    alignItems: "center",
    flex: 2,
    marginLeft: -140,
    marginTop: 2.5,
  },

  remDate: {
    color: "#1C0C5B",
    fontWeight: "bold",
    fontSize: 14,
  },

  closeSec: {
    height: "90%",
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginTop: 2.5,
  },

  header: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
    backgroundColor: "#FF577F",
  },

  inputs: {
    marginTop: 10,
    width: 300,
    display: "flex",
    flexDirection: "row",
    marginLeft: 6.5,
  },

  day: {
    backgroundColor: "#16213E",
    padding: 1,
    // flex: 2,
    width: 100,
    textAlign: "center",
    color: "white",
  },
  mon: {
    backgroundColor: "#16213E",
    padding: 1,
    // flex: 2,
    marginLeft: 5,
    textAlign: "center",
    width: 100,
    color: "white",
  },

  btn: {
    backgroundColor: "#00E7FF",
    marginLeft: 10,
    width: 85,
    color: "black",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
});

const showAlert = (title, message) =>
  Alert.alert(
    title,
    message,
    [
      {
        text: "Cancel",
        style: "cancel",
      },
    ],
    {
      cancelable: true,
    }
  );
