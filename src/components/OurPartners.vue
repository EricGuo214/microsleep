<template>
  <div>
    <h1>Meet Our Partners</h1>
    <v-container>
      <v-text-field v-model="search" append-icon="mdi-magnify" label="Search keywords" single-line hide-details
        style="width: 50%" class="mx-auto"></v-text-field>
      <br />
      <v-row>
        <v-col v-for="t in Hosts" :key="t.id" cols="12" sm="4">
        <div v-if="isTarget(t)">
          <v-card class="mx-auto" max-width="400" style="word-break: break-word" outlined >
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title class="text-h5 mb-1">
                {{ t.fName }} {{ t.lName }}
              </v-list-item-title>
              <v-list-item-subtitle style="overflow: auto">{{ t.desc }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar tile size="100" color="grey">
              <v-img :src="t.photoURL"> </v-img>
            </v-list-item-avatar>
          </v-list-item>

          <v-card-text>
            University:
            <div class="primary--text mb-2" bold>{{ t.school }}</div>
            Available Times:
            <v-list-item v-for="(cls, i) in t.names" :key="i">
              <v-list-item-content v-text="cls"></v-list-item-content>
            </v-list-item>
            Housing Type:
            <v-list-item v-for="(cls, i) in t.types" :key="i">
              <v-list-item-content v-text="cls"></v-list-item-content>
            </v-list-item>
            <!-- <div class="primary--text mb-2" bold>{{ t.maxTut }}</div> -->
          </v-card-text>
          <v-card-actions>
            <v-btn icon @click="t.show = !t.show">
              <v-icon>{{
                  t.show ? "mdi-chevron-up" : "mdi-chevron-down"
              }}</v-icon>
            </v-btn>
            <v-dialog>
              <template #activator="{ on: dialog }">
                <v-tooltip bottom>
                  <template #activator="{ on: tooltip }">
                    <v-btn v-if="wasAuthor(t)" v-on="{ ...tooltip, ...dialog }" class="ma-2" text icon
                      color="red lighten-2">
                      <v-icon>mdi-account-remove</v-icon>
                    </v-btn>
                  </template>
                  <span>Unregister</span>
                </v-tooltip>
              </template>
              <v-card>
                <v-card-title> Confirm Delete </v-card-title>
                <v-card-text>
                  Are you sure you want to unregister? You will have to sign
                  up as a host again.
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="dialog = false;
                  remove(t.id);
                  ">
                    Confirm
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-btn v-if="wasAuthor(t)" text icon to="/profile">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-actions>

          <v-expand-transition>
            <div v-show="t.show">
              <h4>Contact Information</h4>
              <v-list>
                <v-list-item>
                  <v-list-item-avatar>
                    <v-avatar size="50px" tile>
                      <img :src="`https://img-authors.flaticon.com/google.jpg`" :alt="'google logo'" />
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-content>
                      {{ t.email }}
                    </v-list-item-content>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-avatar>
                    <v-avatar size="50px" tile>
                      <img :src="
                        `https://cdn.iconscout.com/icon/free/png-256/facebook-logo-2019-1597680-1350125.png`
                      " :alt="'facebook logo'" />
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-content>
                      {{ t.facebook }}
                    </v-list-item-content>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-avatar v-if="t.instagram.length > 0">
                    <v-avatar size="50px" tile>
                      <img :src="
                        `https://i.pinimg.com/736x/c8/95/2d/c8952d6e421a83d298a219edee783167.jpg`
                      " :alt="'instagram logo'" />
                    </v-avatar>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-content v-if="t.instagram.length > 0">
                      {{ t.instagram }}
                    </v-list-item-content>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
          </v-expand-transition>
          </v-card>
        </div>
        </v-col>



      </v-row>
    </v-container>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  data() {
    return {
      Hosts: [],
      name: null,
      search: "",
      show: false,
      dialog: false,
      isFilled: false,
    };
  },

  computed: {
    filtQ: function () {
      return this.Hosts.filter((q) => {
        return (
          q.school.toLowerCase().match(this.search.toLowerCase()) ||
          q.name.toLowerCase().match(this.search.toLowerCase())
        );
      });
    },
  },

  methods: {
    isTarget(host){
      return host.school.toLowerCase().match(this.search.toLowerCase()) ||
          host.name.toLowerCase().match(this.search.toLowerCase())
    },
    remove(x) {
      const db = firebase.firestore();
      db.collection("Hosts")
        .doc(x)
        .delete();
      db.collection("Hosts")
        .doc(x)
        .collection("Classes")
        .get()
        .then((res) => {
          res.forEach((element) => {
            element.ref.delete();
          });
        });
    },
    wasAuthor(t) {
      return t.id == firebase.auth().currentUser.email;
    },
  },

  created() {
    firebase
      .firestore()
      .collection("Hosts")
      .onSnapshot((querySnapshot) => {
        var fArray = [];
        querySnapshot.forEach((doc) => {
          var host = doc.data();
          host.id = doc.id;
          host.show = false;
          var names = [];
          doc.ref.collection("Available Times").onSnapshot((snap) => {
            snap.forEach((doc) => {
              var cls = doc.data();
              names.push(cls.name);
            });
          });
          var types = [];
          doc.ref.collection("Housing Type").onSnapshot((snap) => {
            snap.forEach((doc) => {
              var housing = doc.data();
              types.push(housing.name);
            });
          }
          );
          host.names = names;
          host.types = types;
          fArray.push(host);

        });
        this.Hosts = fArray;
      });
  },
};
</script>

<style scoped>
body {
  text-align: center;
}

h1 {
  color: #0947c4;
}
</style>

