<template>
  <div>
    <h1 class="text-center">Apply To Be A Host!</h1>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-container style="width: 50%">
        <v-row align="center" justify="center">
          <v-col cols="12" md="5" class="mx-auto">
            <v-text-field v-model="firstName" dense :rules="[
              (v) => !!v || 'This field is required',
              (v) => (v && v.indexOf(' ') == -1) || 'No spaces',
            ]" label="First Name" outlined></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="lastName" dense :rules="[
              (v) => !!v || 'This field is required',
              (v) => (v && v.indexOf(' ') == -1) || 'No spaces',
            ]" label="Last Name" outlined></v-text-field>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">

          <v-col md="5">
            <v-autocomplete v-model="school" dense :rules="[(v) => !!v || 'This field is required']" :items="schools"
              label="Select School" outlined></v-autocomplete>
          </v-col>


          <v-col>
            <v-text-field v-model.number="phonenumber" type="number" label="Phone Number"
              :rules="[(v) => !!v || 'This field is required']">
            </v-text-field>
          </v-col>
        </v-row>

        <v-row align="center" justify="center">
          <v-col cols="12" md="5">
            <v-text-field v-model.number="maxTut" type="number" dense :step="1" :rules="[
              (v) => !!v || 'This field is required',
              (v) => v < 10 || 'Must be less than 10',
            ]" label="Maximum Guests" outlined required></v-text-field>
          </v-col>
          <v-col>
            <v-autocomplete v-model="gender" dense :rules="[(v) => !!v || 'This field is required']" :items="genders"
              label="Gender" outlined></v-autocomplete>
          </v-col>
        </v-row>

        <v-row align="center" justify="center">
          <v-text-field v-model="desc" label="Enter a short description for potential guests to see. Please include Address and Zip Code"
            :rules="[(v) => !!v || 'This field is required']">
          </v-text-field>
        </v-row>

        <!-- <v-row align="center" justify="center">
          <v-select v-model="selectedHousingType" dense :items="housingTypes" item-text="name" :rules="[required]"
            label="What type of housing do you offer?" multiple chips required return-object>
          </v-select>
        </v-row>

        <v-row align="center" justify="center">
          <v-select v-model="selectedTimes" dense :items="times" item-text="name" :rules="[required]"
            label="What times are you available?" multiple chips required return-object>
          </v-select>
        </v-row> -->

        <v-row align="center" justify="center">
          <v-select v-model="housingTypes" dense :items="housingOptions" item-text="name" :rules="[required]"
            label="What type of housing do you offer?" multiple chips required return-object>
          </v-select>
        </v-row>

        <v-row align="center" justify="center">
          <v-select v-model="selectedTimes" dense :items="times" item-text="name" :rules="[required]"
            label="What times are you available?" multiple chips required return-object>
          </v-select>
        </v-row>

        <br />

        <v-row v-for="(cls, i) in selectedClasses" :key="i">
          <v-text-field :rules="[(v) => !!v || 'This field is required']" v-model="cls.teacher"
            :label="cls.name + ' Teacher'">
          </v-text-field>
          <v-select v-model="cls.sem1" :items="academicGrades" :rules="[(v) => !!v || 'This field is required']"
            :label="cls.name + ' Sem 1 Grade'"></v-select>
          <v-select v-model="cls.sem2" :items="academicGrades" :rules="[(v) => !!v || 'This field is required']"
            :label="cls.name + ' Sem 2 Grade'"></v-select>
        </v-row>

        <br />

        <h2>Contact Information</h2>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <v-avatar size="50px" tile>
                <img :src="
                  `https://cdn.iconscout.com/icon/free/png-256/facebook-logo-2019-1597680-1350125.png`
                " :alt="'facebook logo'" />
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-text-field v-model="facebook" :rules="[(v) => !!v || 'This field is required']"
                label="Facebook Username" required></v-text-field>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-avatar>
              <v-avatar size="50px" tile>
                <img :src="
                  `https://i.pinimg.com/736x/c8/95/2d/c8952d6e421a83d298a219edee783167.jpg`
                " :alt="'instagram logo'" />
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-text-field v-model="instagram" label="Instagram (optional)"></v-text-field>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-row align="center" justify="center">
          <v-btn color="primary" @click="submit" :disabled="!valid">
            Submit
          </v-btn>
        </v-row>
      </v-container>
    </v-form>
    <!-- <v-btn color="primary" @click="test">
      test
    </v-btn> -->
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  data: () => ({
    valid: true,


    // firstName: "Rithwik",
    // lastName: "Viaudn",
    // grade: "9",
    // grades: ["9", "10", "11", "12"],
    // phonenumber: 5103546054,
    // selectedClasses: [],
    // gender: "Male",
    // genders: ["Male", "Female", "Other"],
    // maxTut: 9,
    // desc: "I like puie",
    // facebook: "Rbaidun",
    // instagram: "riths",

    firstName: "",
    lastName: "",
    school: null,
    schools: ["USC", "UCLA", "UCSD", "UC Berkeley", "UCI", "UOP", "SCU", "UMD", ],
    phonenumber: null,
    selectedClasses: [],
    gender: "",
    genders: ["Male", "Female", "Other"],
    maxTut: null,
    desc: "",
    facebook: "",
    instagram: "",
    housingTypes: "",
    selectedTimes: "",

    housingOptions: [
      { header: "House" },
      { divider: true },
      { name: "House - Single with Bed" },
      { name: "House - Single with Couch" },
      { name: "House - Double with Bed" },
      { name: "House - Double with Couch" },
      { name: "House - Triple with Bed" },
      { name: "House - Triple with Couch" },
      { divider: true },

      { header: "Dorm" },
      { name: "Dorm - Single with Bed" },
      { name: "Dorm - Single with Couch" },
      { name: "Dorm - Double with Bed" },
      { name: "Dorm - Double with Couch" },
      { name: "Dorm - Triple with Bed" },
      { name: "Dorm - Triple with Couch" },

      { header: "Apartment" },
      { name: "Apartment - Single with Bed" },
      { name: "Apartment - Single with Couch" },
      { name: "Apartment - Double with Bed" },
      { name: "Apartment - Double with Couch" },
      { name: "Apartment - Triple with Bed" },
      { name: "Apartment - Triple with Couch" },
    ],

    times: [
      { name: "Monday"},
      { name: "Tuesday "},
      { name: "Wednesday"},
      { name: "Thursday"},
      { name: "Friday"},
      { name: "Saturday"},
      { name: "Sunday"},

    ],

    photoURL: null,

    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    academicGrades: ["A", "B", "C", "D", "F"],
  }),
  methods: {
    submit() {
      const userEmail = firebase.auth().currentUser.email;

      if (this.$refs.form.validate()) {
        var db = firebase.firestore();
        db.collection("Hosts")
          .doc(userEmail)
          .set({
            name: this.firstName + " " + this.lastName,
            fName: this.firstName,
            lName: this.lastName,
            school: this.school,
            gender: this.gender,
            maxTut: this.maxTut,
            desc: this.desc,
            photoURL: firebase.auth().currentUser.photoURL,
            email: userEmail,
            facebook: this.facebook,
            instagram: this.instagram,
            phonenumber: this.phonenumber,
            housingTypes: this.housingTypes,
            selectedTimes: this.selectedTimes,
          });

        // var batch = db.batch();
        // this.selectedHousingType.forEach((cls) => {
        //   var docRef = db
        //     .collection("Hosts")
        //     .doc(userEmail)
        //     .collection("Housing Type")
        //     .doc(cls.name);

        //   batch.set(docRef, cls);
        // });

        // this.selectedTimes.forEach((cls) => {
        //   var docRef = db
        //     .collection("Hosts")
        //     .doc(userEmail)
        //     .collection("Available Times")
        //     .doc(cls.name);

        //   batch.set(docRef, cls);
        // });

        // batch.commit();

        
        

        this.$router.push("/profile");
      }
    },
    required(value) {
      if (value instanceof Array && value.length == 0) {
        return "Required.";
      }
      return !!value || "Required.";
    },
    test() { },
  },
};
</script>

<style>
h1 {
  color: #046bd1;
  text-align: center;
}

h2 {
  color: #046bd1;
  text-align: center;
}
</style>
