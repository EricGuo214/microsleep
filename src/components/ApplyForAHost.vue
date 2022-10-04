<template>

  <body>
    <div class="half">
      <h1>Apply For A Host</h1>
      <h3>As we are currently growing, response times may vary depending on location</h3>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field v-model="name" dense :rules="[(v) => !!v || 'This field is required']" label="Full name" outlined
          required></v-text-field>

        <v-col>
          <v-text-field v-model.number="phonenumber" type="number" label="Phone Number"
            :rules="[(v) => !!v || 'This field is required']">
          </v-text-field>
        </v-col>

        <v-select v-model="housingTypes" dense :items="housingOptions" item-text="name" :rules="[required]"
          label="Select your preferred housing type" multiple chips required return-object>
        </v-select>
        <br />

        <v-row align="center" justify="center">
          <v-select v-model="selectedTimes" dense :items="times" item-text="name" :rules="[required]"
            label="What times do you need to stay?" multiple chips required return-object>
          </v-select>
        </v-row>
        <br/>

        <v-text-field v-model="address" :rules="[required]"
          label="Please enter the Zip Code of the area OR school you'd like to stay at." outlined>
        </v-text-field>

        <v-text-field v-model="notes" label="Any preferences or notes for your host? (optional)" outlined>
        </v-text-field>

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

        <!-- <v-dialog v-model="dialog" width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              @click="post"
              :disabled="!isValid"
              v-bind="attrs"
              v-on="on"
            >
              Submit
            </v-btn>
          </template>

          <v-card>
            <v-card-title>
              Success!
            </v-card-title>

            <v-card-text>
              Please check your inbox often to see if you have been paired with
              a tutor
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" to=/inbox text @click="dialog = false">
                Inbox
              </v-btn>
              <v-btn color="primary" to=/ text @click="dialog = false">
                Home
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog> -->
        <v-btn :disabled="!isValid" color="primary" @click="submit">
          submit</v-btn>
        <!-- <v-btn color="primary" @click="test"> test</v-btn> -->
      </v-form>
    </div>
  </body>
</template>

<script>
import firebase from "firebase";

export default {
  data: () => ({
    valid: true,
    dialog: false,

    name: "",
    phonenumber: "",
    selectedClasses: [],
    address: "",
    notes: "",
    facebook: "",
    instagram: "",
    // name: "Rithwik V",
    // phonenumber: "150345",
    // selectedClasses: [],
    // notes: "guy",
    // facebook: "rvaidun",
    // instagram: "rith",

    gender: "",
    genders: ["Male", "Female", "Other"],
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
      { name: "Monday" },
      { name: "Tuesday " },
      { name: "Wednesday" },
      { name: "Thursday" },
      { name: "Friday" },
      { name: "Saturday" },
      { name: "Sunday" },
    ]

  }),

  methods: {
    test() {
      console.log(this.selectedClasses);
    },
    submit() {
      if (this.$refs.form.validate()) {
        const userEmail = firebase.auth().currentUser.email;
        var db = firebase.firestore();
        db.collection("Guests")
          .doc(userEmail)
          .set({
            name: this.name,
            notes: this.notes,
            address: this.address,
            email: userEmail,
            facebook: this.facebook,
            instagram: this.instagram,
            phonenumber: this.phonenumber,
            photoURL: firebase.auth().currentUser.photoURL,
            housingTypes: this.housingTypes,
            selectedTimes: this.selectedTimes,
          });

        // var batch = db.batch();
        // console.log(this.selectedClasses);

        // this.selectedHousingTypes.forEach((cls) => {
        //   var docRef = db
        //     .collection("Guests")
        //     .doc(userEmail)
        //     .collection("Housing Types")
        //     .doc(cls.name);
        //   cls.p = false;
        //   cls.tutor = {};
        //   batch.set(docRef, cls);
        // });

        // this.selectedTimes.forEach((cls) => {
        //   var docRef = db
        //     .collection("Guests")
        //     .doc(userEmail)
        //     .collection("Preferred Times")
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
  },
  computed: {
    isValid() {
      return this.name != "" && this.housingTypes.length != 0;
    },
  },
};
</script>

<style scoped>
.half {
  text-align: center;
  margin: auto;
  width: 50%;
}

h1 {
  color: #0947c4;
}
</style>
