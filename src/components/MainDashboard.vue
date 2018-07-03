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
      :pagination.sync="pagination"
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
    <div class="text-xs-center pt-2">
      <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
    </div>
    <!-- <span v-for="item in selected" :key="item.id">
      {{item.id}}
    </span> -->
    <div class="text-xs-center pt-2">
      <v-btn @click="deleteSelected(selected)" color="red" class="white--text" v-if="selected.length !== 0">Delete</v-btn>
      <v-btn color="primary" @click.native="toggleOrder">Toggle sort order</v-btn>
      <v-btn color="primary" @click.native="nextSort">Sort next column</v-btn>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data: () => ({
    dialog: false,
    selected: [],
    search: '',
    pagination: {
      sortBy: 'tgl_masuk'
    },
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
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    pages() {
      if (
        this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      )
        return 0

      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    }
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.inventory = [
        {
          id: 'sOvD60',
          lab: 'IFLAB 3',
          kategori: 'Peripherals',
          nama: 'Mercury',
          status: 'Baik',
          tgl_masuk: '2017-05-08',
          tgl_keluar: '2018-06-17'
        },
        {
          id: 'cYRhoWL8FB',
          lab: 'ITLAB 1',
          kategori: 'Peripherals',
          nama: 'Hummer',
          status: 'Rusak',
          tgl_masuk: '2017-07-19',
          tgl_keluar: '2018-06-18'
        },
        {
          id: 'RZb2IVNb1EN',
          lab: 'ITLAB 2',
          kategori: 'Monitor',
          nama: 'GMC',
          status: 'Rusak',
          tgl_masuk: '2017-03-24',
          tgl_keluar: '2018-06-11'
        },
        {
          id: 'mFxfFRHYGvC',
          lab: 'IFLAB 3',
          kategori: 'Peripherals',
          nama: 'BMW',
          status: 'Rusak',
          tgl_masuk: '2017-07-24',
          tgl_keluar: '2018-06-24'
        },
        {
          id: 'jZh6Ohy',
          lab: 'IFLAB 5',
          kategori: 'PC',
          nama: 'Volvo',
          status: 'Baik',
          tgl_masuk: '2017-03-19',
          tgl_keluar: '2018-06-22'
        },
        {
          id: 'fWXenLrG7',
          lab: 'ITLAB 1',
          kategori: 'Monitor',
          nama: 'Chrysler',
          status: 'Rusak',
          tgl_masuk: '2017-02-21',
          tgl_keluar: '2018-06-10'
        },
        {
          id: 'mmPB4SVIQBC',
          lab: 'IFLAB 2',
          kategori: 'Monitor',
          nama: 'Infiniti',
          status: 'Baik',
          tgl_masuk: '2017-03-01',
          tgl_keluar: '2018-06-12'
        },
        {
          id: 'J0YUShx5kz',
          lab: 'IFLAB 4',
          kategori: 'PC',
          nama: 'Honda',
          status: 'Baik',
          tgl_masuk: '2017-06-24',
          tgl_keluar: '2018-06-29'
        },
        {
          id: 'MdNMT4mE',
          lab: 'IFLAB 1',
          kategori: 'PC',
          nama: 'Mercedes-Benz',
          status: 'Rusak',
          tgl_masuk: '2017-04-05',
          tgl_keluar: '2018-06-22'
        },
        {
          id: 'aY83jfW',
          lab: 'IFLAB 4',
          kategori: 'Peripherals',
          nama: 'Honda',
          status: 'Baik',
          tgl_masuk: '2017-03-29',
          tgl_keluar: '2018-06-17'
        },
        {
          id: '7XWnfaqqEt',
          lab: 'ITLAB 1',
          kategori: 'PC',
          nama: 'Chevrolet',
          status: 'Baik',
          tgl_masuk: '2017-05-27',
          tgl_keluar: '2018-06-29'
        },
        {
          id: 'RaNSxDVo2qNu',
          lab: 'IFLAB 4',
          kategori: 'Peripherals',
          nama: 'Pontiac',
          status: 'Baik',
          tgl_masuk: '2017-04-21',
          tgl_keluar: '2018-06-15'
        },
        {
          id: 'XFByuRzyxao',
          lab: 'ITLAB 2',
          kategori: 'Monitor',
          nama: 'Suzuki',
          status: 'Baik',
          tgl_masuk: '2017-06-03',
          tgl_keluar: '2018-06-26'
        },
        {
          id: 'a0MEVoBJF',
          lab: 'IFLAB 5',
          kategori: 'PC',
          nama: 'Kia',
          status: 'Rusak',
          tgl_masuk: '2017-03-27',
          tgl_keluar: '2018-06-21'
        },
        {
          id: 'o1JGJHFs8UHh',
          lab: 'ITLAB 1',
          kategori: 'Monitor',
          nama: 'Aston Martin',
          status: 'Rusak',
          tgl_masuk: '2017-04-02',
          tgl_keluar: '2018-06-14'
        },
        {
          id: '7jA98t3g19P',
          lab: 'IFLAB 5',
          kategori: 'Peripherals',
          nama: 'Infiniti',
          status: 'Rusak',
          tgl_masuk: '2017-03-14',
          tgl_keluar: '2018-06-25'
        },
        {
          id: 'sLi2Cz',
          lab: 'IFLAB 4',
          kategori: 'Monitor',
          nama: 'Dodge',
          status: 'Baik',
          tgl_masuk: '2017-02-25',
          tgl_keluar: '2018-06-22'
        },
        {
          id: 'qGAf2U',
          lab: 'IFLAB 2',
          kategori: 'Monitor',
          nama: 'Pontiac',
          status: 'Rusak',
          tgl_masuk: '2017-02-06',
          tgl_keluar: '2018-06-24'
        },
        {
          id: '7SVMaFa7wJDX',
          lab: 'IFLAB 1',
          kategori: 'PC',
          nama: 'Mitsubishi',
          status: 'Rusak',
          tgl_masuk: '2017-02-16',
          tgl_keluar: '2018-06-24'
        },
        {
          id: 'Lfxtlpj2',
          lab: 'ITLAB 2',
          kategori: 'PC',
          nama: 'Ford',
          status: 'Baik',
          tgl_masuk: '2017-08-01',
          tgl_keluar: '2018-06-20'
        }
      ]
      // axios.get('https://my.api.mockaroo.com/my_saved_schema.json?key=00599a10')
      //   .then(response=> {
      //     this.inventory = response.data
      //   })
    },

    editItem(item) {
      this.editedIndex = this.inventory.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem(item) {
      const index = this.inventory.indexOf(item)
      confirm('Are you sure you want to delete this item?') &&
        this.inventory.splice(index, 1)
    },
    deleteSelected(selected) {
      // this.inventory.filter(item => !selected.includes(item.id))
      for (let index = 0; index < selected.length; index++) {
        // const element = array[index];
        deleteItem(selected)
        
      }
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.inventory[this.editedIndex], this.editedItem)
      } else {
        this.inventory.push(this.editedItem)
      }
      this.close()
    }
  }
}
</script>