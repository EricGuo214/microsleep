<template>

  <body>
    <h1>Your Profile</h1>
    <v-col v-if="this.host.selectedTimes.length >= 1" cols="12" sm="4" class="justify-center">
      <v-card max-width="450" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="text-h5 mb-1">
              {{ this.host.fName }} {{ this.host.lName }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <h3>{{ this.host.desc }}</h3>
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-avatar tile size="100" color="grey">
            <v-img :src="this.host.photoURL"> </v-img>
          </v-list-item-avatar>
        </v-list-item>
        <v-card-text>
          <h4>School:</h4>
          <v-list-item>
            <v-list-item-content>
              {{this.host.school}}
            </v-list-item-content>
          </v-list-item>
          <h4>Phone Number:</h4>
          <v-list-item>
            <v-list-item-content>
              {{this.host.phonenumber}}
            </v-list-item-content>
          </v-list-item>
          <h4>Gender:</h4>
          <v-list-item>
            <v-list-item-content>
              {{this.host.gender}}
            </v-list-item-content>
          </v-list-item>


          <h4>Housing Type:</h4>
          <v-list-item v-for="(cls, i) in host.housingTypes" :key="i">
            <v-list-item-content v-text="cls.name"></v-list-item-content>
          </v-list-item>


          <h4>Available Times:</h4>
          <v-list-item v-for="(cls, i) in this.host.selectedTimes" :key="i">
            <v-list-item-content v-text="cls.name"></v-list-item-content>
          </v-list-item>

          <h4>Maximum Number of Guests:</h4>
          <div class="primary--text mb-2" bold>{{ this.host.maxTut }}</div>

          <h4>Facebook Username:</h4>
          <v-list-item>
            <v-list-item-content>
              {{this.host.facebook}}
            </v-list-item-content>
          </v-list-item>

        </v-card-text>
      </v-card>
      <br />
      <div class="my-2">
        <v-btn color="primary" to="/UpdateHost">
          Update Host Information
        </v-btn>
      </div>
      <br />
      <br />
    </v-col>

    <v-col v-if="this.guest.selectedTimes.length >= 1" cols="12" sm="4" class="justify-center">
      <v-card max-width="450" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <v-list-item-title class="text-h5 mb-1">
              {{ this.guest.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <h3>{{ this.guest.notes }}</h3>
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-avatar tile size="100" color="grey">
            <v-img :src="this.guest.photoURL"> </v-img>
          </v-list-item-avatar>
        </v-list-item>

        <v-card-text>
          <h4>Phone Number:</h4>
          <v-list-item>
            <v-list-item-content>
              {{this.guest.phonenumber}}
            </v-list-item-content>
          </v-list-item>

          <h4>Housing Type:</h4>
          <v-list-item v-for="(cls, i) in guest.housingTypes" :key="i">
            <v-list-item-content v-text="cls.name"></v-list-item-content>
          </v-list-item>

          <h4>Stay Time:</h4>
          <v-list-item v-for="(cls, i) in guest.selectedTimes" :key="i">
            <v-list-item-content v-text="cls.name"></v-list-item-content>
          </v-list-item>

          <h4>Staying at Zip Code / School:</h4>
          <v-list-item>
            <v-list-item-content>
              {{this.guest.address}}
            </v-list-item-content>
          </v-list-item>

          <h4>Facebook:</h4>
          <v-list-item>
            <v-list-item-content>
              {{this.guest.facebook}}
            </v-list-item-content>
          </v-list-item>

        </v-card-text>
      </v-card>
      <br />
      <div class="my-2">
        <v-btn color="primary" to="/UpdateGuest">
          Update Guest Information
        </v-btn>
      </div>
      <br />
      <br />
    </v-col>
  </body>
</template>
<script>
import firebase from "firebase";

export default {
  data: () => ({
    hostTimes: [],
    hostHousingTypes: [],
    host: "",
    guest: "",
    guestTimes: [],
    guestHousingTypes: [],
  }),

  created() {
    const db = firebase.firestore();
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const userEmail = firebase.auth().currentUser.email;
        db.collection("Hosts")
          .doc(userEmail)
          .get()
          .then(doc => {
            this.host = doc.data();
          });

        // db.collection("Hosts")
        //   .doc(userEmail)
        //   .collection("Available Times")
        //   .onSnapshot(querySnapshot => {
        //     querySnapshot.forEach(doc => {
        //       this.hostTimes.push(doc.data().name);
        //     });
        //   });

        // db.collection("Hosts")
        //   .doc(userEmail)
        //   .collection("Housing Type")
        //   .onSnapshot(querySnapshot => {
        //     querySnapshot.forEach(doc => {
        //       this.hostHousingTypes.push(doc.data().name);
        //     });
        //   });

        db.collection("Guests")
          .doc(userEmail)
          .get()
          .then(doc => {
            this.guest = doc.data();
          });

        db.collection("Guests")
          .doc(userEmail)
          .collection("Preferred Times")
          .onSnapshot(querySnapshot => {
            querySnapshot.forEach(doc => {
              this.guestTimes.push(doc.data().name);
            });
          });

          db.collection("Guests")
          .doc(userEmail)
          .collection("Housing Types")
          .onSnapshot(querySnapshot => {
            querySnapshot.forEach(doc => {
              this.guestHousingTypes.push(doc.data().name);
            });
          });
      }
    });
  }
};
</script>
<style scoped>
.half {
  text-align: center;
  margin: auto;
}

.color {
  text-color: #000000;
}

.pad {
  left-margin: 300px;
  right-margin: 300px;
}
</style>
