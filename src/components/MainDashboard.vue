<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Inventory</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
        <v-btn slot="activator" color="primary" dark class="mb-2">New Item</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout row wrap>
                <v-flex xs12 sm6 md12>
                  <v-text-field v-model="editedItem.id" label="ID Barang"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <v-select
                    v-model="editedItem.lab"
                    :items="dropdown_lab"
                    label="LAB"
                    required
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <v-select
                    v-model="editedItem.kategori"
                    :items="dropdown_kategori"
                    label="Kategori"
                    required
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <v-text-field v-model="editedItem.nama" label="Nama"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <v-select
                    v-model="editedItem.status"
                    :items="dropdown_status"
                    label="Status"
                    required
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <v-menu
                    ref="menu"
                    :close-on-content-click="false"
                    v-model="menu"
                    :nudge-right="40"
                    :return-value.sync="editedItem.tgl_masuk"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="editedItem.tgl_masuk"
                      label="Tanggal Masuk"
                      prepend-icon="event"
                      readonly
                    ></v-text-field>
                    <v-date-picker v-model="editedItem.tgl_masuk" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.menu.save(editedItem.tgl_masuk)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <v-menu
                    ref="menu"
                    :close-on-content-click="false"
                    v-model="menu"
                    :nudge-right="40"
                    :return-value.sync="editedItem.tgl_keluar"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="editedItem.tgl_keluar"
                      label="Tanggal Keluar"
                      prepend-icon="event"
                      readonly
                    ></v-text-field>
                    <v-date-picker v-model="editedItem.tgl_keluar" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.menu.save(editedItem.tgl_keluar)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table
      :headers="headers"
      :items="inventory"
      :search="search"
      select-all
      hide-actions
      class="elevation-1"
      item-key="id"
      v-model="selected"
    >
      <template slot="items" slot-scope="props">
        <td>
          <v-checkbox
          v-model="props.selected"
          primary
          hide-details
          ></v-checkbox>
        </td>
        
        <td>{{ props.item.id }}</td>
        <td class="text-xs-right">{{ props.item.lab }}</td>
        <td class="text-xs-right">{{ props.item.kategori }}</td>
        <td class="text-xs-right">{{ props.item.nama }}</td>
        <td class="text-xs-right">{{ props.item.status }}</td>
        <td class="text-xs-right">{{ props.item.tgl_masuk }}</td>
        <td class="text-xs-right">{{ props.item.tgl_keluar }}</td>
        <td class="justify-center layout px-0">
          <v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          >
            edit
          </v-icon>
          <v-icon
            small
            @click="deleteItem(props.item)"
          >
            delete
          </v-icon>
        </td>
      </template>
      <template slot="no-data">
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
      <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>
    </v-data-table>
    <span v-for="item in selected" :key="item.id">
      {{item.id}}
    </span>
  </div>
</template>
<script>
export default {
  data: () => ({
    dialog: false,
    selected: [],
    search: '',
    dropdown_lab: [
      'IFLAB 1',
      'IFLAB 2',
      'IFLAB 3',
      'IFLAB 4',
      'IFLAB 5',
      'ITLAB 1',
      'ITLAB 2'
    ],
    dropdown_kategori: ['PC', 'Monitor', 'Peripherals', 'Meja'],
    dropdown_status: ['Baik', 'Rusak'],
    headers: [
      {
        text: 'ID Barang',
        align: 'left',
        value: 'id'
      },
      { text: 'LAB', value: 'lab' },
      { text: 'Kategori', value: 'kategori' },
      { text: 'Nama', value: 'nama' },
      { text: 'Status', value: 'status' },
      { text: 'Tanggal Masuk', value: 'tgl_masuk' },
      { text: 'Tanggal Keluar', value: 'tgl_keluar' },
      { text: 'Actions', value: 'id', sortable: false }
    ],
    inventory: [],
    editedIndex: -1,
    editedItem: {
      id: '',
      lab: null,
      kategori: '',
      nama: '',
      status: '',
      tgl_masuk: '',
      tgl_keluar: ''
    },
    defaultItem: {
      id: '',
      lab: '',
      kategori: '',
      nama: '',
      status: '',
      tgl_masuk: '',
      tgl_keluar: ''
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item';
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.inventory = [
        {
          id: 'q8tCmjhzwZ',
          lab: 'IFLAB 1',
          kategori: 'PC',
          nama: 'Volkswagen',
          status: false,
          tgl_masuk: '2017-04-11',
          tgl_keluar: '2018-06-11'
        },
        {
          id: 'LV43o5',
          lab: 'IFLAB 4',
          kategori: 'Monitor',
          nama: 'Hummer',
          status: true,
          tgl_masuk: '2017-02-02',
          tgl_keluar: '2018-06-13'
        }
      ];
    },

    editItem(item) {
      this.editedIndex = this.inventory.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.inventory.indexOf(item);
      confirm('Are you sure you want to delete this item?') &&
        this.inventory.splice(index, 1);
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.inventory[this.editedIndex], this.editedItem);
      } else {
        this.inventory.push(this.editedItem);
      }
      this.close();
    }
  }
};
</script>