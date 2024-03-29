<template>
  <div>
    <h2 class="centered">Tutors</h2>
    <br>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        @click:row="rowClickTutor"
        v-model="selected1"
        item-key="name"
        single-select
        dense
        :headers="headers1"
        :items="tutors"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:[`item.maxTut`]="{ item }">
          <v-chip v-if="item.maxTut == 0" color="red">
            {{ item.maxTut }}
          </v-chip>
          <div v-else>{{ item.maxTut }}</div>
        </template>

        <template v-slot:top>
          <v-dialog v-model="dialog" max-width="500px">
            <v-data-table
              :headers="gradeHeaders"
              :items="gradeT"
              hide-default-footer
            ></v-data-table>
          </v-dialog>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon @click.prevent="open(item)"> mdi-school </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <br />
    <h2 class="centered">Tutees</h2>
    <br>
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        v-model="selected2"
        item-key="name"
        single-select
        dense
        :headers="headers2"
        :items="tutees"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:[`item.paired`]="{ item }">
          <v-icon
            v-for="(cls, i) in item.paired"
            :key="i"
            :color="!item.paired[i] ? 'red' : 'green'"
          >
            {{
              !item.paired[i] ? "mdi-close-thick" : "mdi-checkbox-marked-circle"
            }}
          </v-icon>
        </template>
        <template v-slot:[`item.classes`]="{ item }">
          <v-btn
            v-for="(cls, i) in item.classes"
            @click="rowClickTutee(item, cls.name)"
            small
            rounded
            :disabled="cls.p"
            :color="
              clicked == cls.name && tutee.email == cls.tutee ? 'primary' : ''
            "
            :key="i"
          >
            {{ cls.name }}
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <div class="half">
      <h2>{{ tutor.name }} x {{ tutee.name }}({{ clicked }})</h2>
      <v-btn
        :disabled="!valid"
        color="primary"
        @click="pair(tutor, tutee, false)"
      >
        Match
      </v-btn>
      <h4 class="red--text">{{ error }}</h4>

      <!-- <v-btn color="primary" @click="test"> test </v-btn> -->
      <v-btn
        :disabled="!overrideValid"
        color="error"
        @click="pair(tutor, tutee, true)"
      >
        override
      </v-btn>

      <v-select
        v-model="overrideClass"
        dense
        :items="this.tutor.sClass"
        :rules="[required]"
        label="Select class"
        required
      >
      </v-select>
    </div>
    <h2>Pairs</h2>
    <v-switch
      v-model="viewToggle"
      :label="viewToggle ? 'Tutee View' : 'Tutor View'"
    ></v-switch>

    <!-- TUTEE VIEW -->
    <v-container v-if="viewToggle">
      <v-row no-gutters justify="space-around">
        <v-col v-for="(pair, i) in this.pairedTutees" :key="i" cols="12" sm="3">
          <v-card class="mx-auto" max-width="344" outlined>
            <v-card-title class="title primary--text pl=0">
              {{ pair.tutee.name }}
            </v-card-title>
            <v-list-item v-for="(t, i) in pair.tInfo" :key="i">
              {{ t.name }}--- {{ t.tutor }}
              <v-btn
                text
                icon
                depressed
                color="error"
                @click="unpair(t.emailOfTutor, pair.tutee, t.name)"
              >
                <v-icon>mdi-account-multiple-remove-outline</v-icon>
              </v-btn>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- TUTOR VIEW -->
    <v-container v-else>
      <v-row no-gutters>
        <v-col v-for="(pair, i) in this.pairedTutors" :key="i" cols="12" sm="3">
          <v-card class="mx-auto" outlined>
            <v-card-title class="title primary--text pl=0">
              {{ pair.tutor.name }}
            </v-card-title>
            <v-list-item v-for="(t, i) in pair.tInfo" :key="i">
              {{ t.name }} --- {{ getTutees(t) }}</v-list-item
            >
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-card max-width="344" outlined>
      <v-text-field
        class="half"
        style="width: 70%"
        v-model="emailOfNewAdmin"
      ></v-text-field>
      <v-card-actions>
        <v-btn @click="makeAdmin">make admin </v-btn>
      </v-card-actions>
    </v-card>
    <v-spacer></v-spacer>
    <!-- <v-card>
      <v-text-field v-model="emailOfNewAdmin"></v-text-field>
      <v-btn @click="addToAdminCollection">add to collection </v-btn>
    </v-card> -->
  </div>
</template>

<script>
import firebase from "firebase";
import axios from "axios";
export default {
  data() {
    return {
      dialog: false,
      clicked: "",
      overrideClass: "",
      emailOfNewAdmin: null,
      search: "",
      tutor: {},
      tutee: {},
      selected1: [],
      selected2: [],
      toggle_exclusive: null,
      headers1: [
        {
          text: "Name",
          align: "start",
          filterable: false,
          value: "name",
        },
        { text: "Gender", value: "gender" },
        { text: "Classes", value: "sClass" },
        { text: "Email", value: "email" },
        { text: "Phone Number", value: "phonenumber" },
        { text: "Tutee spots left", value: "maxTut" },
        { text: "Grade", value: "grade" },
        { text: "Facebook", value: "facebook" },
        { text: "Grades", value: "actions", sortable: false },
      ],
      headers2: [
        {
          text: "Name",
          align: "start",
          filterable: false,
          value: "name",
        },
        { text: "Classes", value: "classes" },
        { text: "Paired?", value: "paired" },
        { text: "Email", value: "email" },
        { text: "Facebook", value: "facebook" },
        { text: "Notes", value: "notes" },
      ],
      gradeHeaders: [
        {
          text: "Class",
          align: "start",
          filterable: false,
          value: "name",
        },
        { text: "Teacher", value: "teacher" },
        { text: "Semester 1", value: "sem1" },
        { text: "Semester 2", value: "sem2" },
      ],
      tutors: [],
      tutees: [],
      pairs: [],
      gradeT: [],
      viewToggle: true,
      pairedTutors: {},
      pairedTutees: {},
    };
  },
  methods: {
    makeAdmin() {
      // var addMessage = firebase.functions().httpsCallable("addAdminRole");
      // addMessage({ email: "david.dw.guo@gmail.com" }).then((result) => {
      //   console.log(result.data.message);
      // });
      axios
        .post("functions/addAdminRole", { email: this.emailOfNewAdmin })
        .then((res) => {
          console.log(res.data.message);
        })
        .then(() => {
          firebase
            .firestore()
            .collection("Admins")
            .doc(this.emailOfNewAdmin)
            .set({
              email: this.emailOfNewAdmin,
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addToAdminCollection() {
      firebase
        .firestore()
        .collection("Admins")
        .doc(this.emailOfNewAdmin)
        .set({
          email: this.emailOfNewAdmin,
          adder: firebase.auth().currentUser.email,
        });
    },

    rowClickTutor: function(item, row) {
      if (item.maxTut == 0) {
        row.disable(true);
      }
      if (row.isSelected) {
        row.select(false);
        this.tutor = {};
      } else {
        row.select(true);
        this.tutor = item;
      }
      this.gradeT = this.tutor.classes;
    },
    rowClickTutee: function(tutee, selectedClass) {
      this.tutee = tutee;
      this.clicked = selectedClass;
      console.log(tutee);
    },
    pair(tutor, tutee, override) {
      var updateClass = override ? this.overrideClass : this.clicked;
      firebase
        .firestore()
        .collection("Tutees")
        .doc(tutee.email)
        .collection("Classes")
        .doc(this.clicked)
        .update({
          tutor: { tutorName: tutor.name, tutorEmail: tutor.email },
          p: true,
        });

      firebase
        .firestore()
        .collection("OurTutors")
        .doc(tutor.email)
        .collection("Classes")
        .doc(updateClass)
        .update({
          tutees: firebase.firestore.FieldValue.arrayUnion({
            tuteeName: tutee.name,
            tuteeEmail: tutee.email,
          }),
        });

      const dec = firebase.firestore.FieldValue.increment(-1);
      firebase
        .firestore()
        .collection("OurTutors")
        .doc(tutor.email)
        .update({
          maxTut: dec,
        });

      this.tutor = {};
      this.tutee = {};
      this.selected1 = [];
      this.selected2 = [];
      this.clicked = "";
    },

    unpair(tutorEmail, tutee, cls) {
      console.log("unpair: ", tutorEmail, tutee.name, tutee.email, cls);
      // removes tutee from Tutor's list of tutees
      firebase
        .firestore()
        .collection("OurTutors")
        .doc(tutorEmail)
        .collection("Classes")
        .doc(cls)
        .update({
          tutees: firebase.firestore.FieldValue.arrayRemove({
            tuteeName: tutee.name,
            tuteeEmail: tutee.email,
          }),
        });
      console.log("tutee removed from Tutor's list of clases");
      // removes tutor from Tutee's tutors
      firebase
        .firestore()
        .collection("Tutees")
        .doc(tutee.email)
        .collection("Classes")
        .doc(cls)
        .update({
          tutor: null,
          p: false,
        });
      console.log("tutor removed from Tutee's tutors");
      const indexOfRemoved = this.pairedTutees.indexOf(tutee);
      this.pairedTutees.splice(indexOfRemoved, 1);
      const inc = firebase.firestore.FieldValue.increment(1);
      firebase
        .firestore()
        .collection("OurTutors")
        .doc(tutorEmail)
        .update({
          maxTut: inc,
        });
    },

    test() {
      var classes = this.tutor.classes.map((a) => a.name);
      console.log(classes);
    },
    getTutees(t) {
      var ret = "";
      for (var i = 0; i < t.tutees.length; i++) {
        ret += t.tutees[i].tuteeName + ", ";
      }
      return ret;
    },

    open() {
      this.dialog = true;
    },
    required(value) {
      if (value instanceof Array && value.length == 0) {
        return "Required.";
      }
      return !!value || "Required.";
    },
  },
  created() {
    const db = firebase.firestore();
    var allTutorPairs = [];
    db.collection("OurTutors").onSnapshot((querySnapshot) => {
      var fArray = [];
      querySnapshot.forEach((doc) => {
        let tutor = doc.data();
        tutor.id = doc.id;
        var names = [];
        var classes = [];

        doc.ref.collection("Classes").onSnapshot((snap) => {
          snap.forEach((doc) => {
            var cls = doc.data();
            classes.push({
              name: cls.name,
              sem1: cls.sem1,
              sem2: cls.sem2,
              teacher: cls.teacher,
            });
            names.push(cls.name);
          });
        });
        tutor.sClass = names;
        tutor.classes = classes;

        fArray.push(tutor);

        doc.ref
          .collection("Classes")
          .where("tutees", "!=", [])
          .onSnapshot((snap) => {
            var tutorPairings = [];
            snap.forEach((doc1) => {
              let cls = doc1.data();
              //console.log("class", cls);
              tutorPairings.push({ name: cls.name, tutees: cls.tutees });
            });
            // console.log("pair", JSON.stringify(tutorPairings));
            if (tutorPairings.length !== 0) {
              allTutorPairs.push({ tutor: tutor, tInfo: tutorPairings });
            }
          });
        this.pairedTutors = allTutorPairs;
        //console.log("tutors", JSON.stringify(this.pairedTutors));
      });

      this.tutors = fArray;
    });
    var allPairs = [];

    db.collection("Tutees").onSnapshot((querySnapshot) => {
      var fArray = [];
      querySnapshot.forEach((doc) => {
        let tutee = doc.data();
        // START CLASSES
        doc.ref.collection("Classes").onSnapshot((snap) => {
          var paired = [];
          var names = [];
          var classes1 = [];
          snap.forEach((doc) => {
            var cls = doc.data();
            classes1.push({ name: cls.name, p: cls.p, tutee: tutee.email });
            paired.push(cls.p);
            names.push(cls.name);
          });
          tutee.classes = classes1;
          tutee.sClass = names;
          tutee.paired = paired;
          var found = false;
          for (var i = 0; i < fArray.length; i++) {
            var t = fArray[i];
            if (t.email == tutee.email) {
              found = true;
              fArray[i] = tutee;
            }
          }
          if (!found) {
            fArray.push(tutee);
          }
        });
        // END CLASSES

        doc.ref //per specific tutee
          .collection("Classes")
          .where("p", "==", true) //all classes which have tutor
          .onSnapshot((snap) => {
            var tuteePairings = []; //[{name: chem, tutor: karad, tutee: tutee}]
            //for each class that has tutor
            snap.forEach((doc1) => {
              let cls = doc1.data();
              tuteePairings.push({
                name: cls.name,
                tutor: cls.tutor.tutorName,
                emailOfTutor: cls.tutor.tutorEmail,
              });
            });
            if (tuteePairings.length !== 0) {
              allPairs.push({ tutee: tutee, tInfo: tuteePairings });
              this.pairedTutees = allPairs;
            }

            // console.log("tutees", JSON.stringify(this.pairedTutees));
          });
      });
      this.tutees = fArray;
    });
  },
  computed: {
    error() {
      if (Object.keys(this.tutor).length == 0) {
        return "Select a tutor";
      }
      if (Object.keys(this.tutee).length == 0) {
        return "Select a tutee";
      }
      if (
        Object.keys(this.tutor).length != 0 &&
        Object.keys(this.tutee).length != 0
      ) {
        if (!this.tutor.sClass.includes(this.clicked)) {
          return "Tutor does not teach this class";
        }
      }
      return "";
    },
    valid() {
      return (
        Object.keys(this.tutor).length != 0 &&
        Object.keys(this.tutee).length != 0 &&
        this.tutor.sClass.includes(this.clicked)
      );
    },
    overrideValid() {
      return (
        Object.keys(this.tutor).length != 0 &&
        Object.keys(this.tutee).length != 0 &&
        this.overrideClass != ""
      );
    },
  },
};
// firebase
//   .firestore()
//   .collection("Tutees")
//   .doc(tutee.id)
//   .get()
//   .then((doc) => {
//     var classes = doc.data().classes;
//     var cls = classes[tutee.clsID];
//     cls.p = true;
//     classes[tutee.clsID] = cls;
//     firebase
//       .firestore()
//       .collection("Tutees")
//       .doc(tutee.id)
//       .update({ classes: classes });
//   });

// //for tutors to find their tutees
</script>

<style>
.half {
  text-align: center;
  margin: auto;
  width: 50%;
}
tr.v-data-table__selected {
  background: #7d92f5 !important;
}
.cc {
  background: blue !important;
}
.centered{
  text-align: center;
  color: #0947C4;
}
h1{
  color: #0947C4;
}
</style>
