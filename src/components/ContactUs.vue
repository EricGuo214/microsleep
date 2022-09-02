<template>
  <div>
    <v-card class="mx-auto" outlined>
      <v-list-item three-line class="centers">
        <v-list-item-content>
          <v-list-item-title class="text-h5 mb-1">
            Contact Us
          </v-list-item-title>
          <v-list-item-subtitle>Feel free to contact us at
            <strong> eric.w.guo@microsleep.org </strong> if you have any
            questions, comments, or concerns.
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>

    <v-container vertical-align: middle class="text-center">
      <h2 class="display-2 font-weight-bold mb-3">MICROSLEEP TEAM</h2>

      <v-responsive class="mx-auto mb-12" width="56">
        <v-divider class="mb-1"></v-divider>

        <v-divider></v-divider>
      </v-responsive>

      <v-row>
        <v-col v-for="({ image, title, text }, i) in stemTeam" :key="i" cols="12" md="3">
          <v-card class="py-12 px-4" color="grey lighten-5" flat>
            <v-theme-provider dark>
              <div>
                <v-avatar size="88">
                  <img :src="image" />
                </v-avatar>
              </div>
            </v-theme-provider>

            <v-card-title class="justify-center font-weight-black text-uppercase" v-text="title"></v-card-title>

            <v-card-text class="subtitle-1" v-text="text"> </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <h2 class="display-2 font-weight-bold mb-3">WEBSITE CREATORS</h2>

      <v-row>
        <v-col v-for="({ image, title }, i) in website" :key="i" cols="12" md="3">
          <v-card class="py-12 px-4" color="grey lighten-5" flat>
            <v-theme-provider dark>
              <div>
                <v-avatar size="88">
                  <img :src="image" />
                </v-avatar>
              </div>
            </v-theme-provider>

            <v-card-title class="justify-center font-weight-black text-uppercase" v-text="title"></v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stemTeam: [
        {
          image: require("./Pictures/ericPic.jpeg"),
          title: "Eric Guo",
          text: "Nice to meet you! I created and led this website to facilitate the complexity of student housing and expand the ease of access for university housing and connectivity.  My hobbies are coding, dancing, and playing the piano!",
        },
        {
          image: require("./Pictures/david.jpg"),
          title: "David Guo",
          text: "Nice to meet you! I created and led this website to facilitate the complexity of organization and expand the ease of access for academic support.  My hobbies are coding, dancing, and playing the piano!",
        },
      ],
      website: [
        {
          image: require("./Pictures/ericPic.jpeg"),
          title: "Eric Guo",
          // text:
          // "I joined Mission tutoring to improve Mission San Jose High School's student experiences in challenging courses. My goal is to develop a website that benefits all participants with meaningful experiences and a sense of community. I hope that everybody who uses this website achieves their desired results! I enjoy dancing, reading, and exercise.",
        },
        {
          image: require("./Pictures/david.jpg"),
          title: "David Guo",
        },

      ],
    };
  },
};
</script>

<style>
.centers {
  text-align: center;
}

h1 {
  color: #0947c4;
}
</style>
