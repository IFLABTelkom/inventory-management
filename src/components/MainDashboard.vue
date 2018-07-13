<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Inventory</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
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
                <v-flex v-if="this.editedIndex != -1" xs12 sm6 md12>
                  <v-text-field disabled v-model="editedItem.id" label="ID Barang"></v-text-field>
                </v-flex>
                <v-flex v-else xs12 sm6 md12>
                  <v-text-field v-model="editedItem.id" label="ID Barang"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <v-select v-model="editedItem.lab" :items="dropdown_lab" label="LAB" required></v-select>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <v-select v-model="editedItem.kategori" :items="dropdown_kategori" label="Kategori" required></v-select>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <v-text-field v-model="editedItem.nama" label="Nama"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <v-select v-model="editedItem.status" :items="dropdown_status" label="Status" required></v-select>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <v-menu ref="menu_tgl_masuk" :close-on-content-click="false" v-model="menu_tgl_masuk" :nudge-right="40" :return-value.sync="editedItem.tgl_masuk" lazy transition="scale-transition" offset-y full-width min-width="290px">
                    <v-text-field slot="activator" v-model="editedItem.tgl_masuk" label="Tanggal Masuk" prepend-icon="event" readonly></v-text-field>
                    <v-date-picker v-model="editedItem.tgl_masuk" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="menu_tgl_masuk = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.menu_tgl_masuk.save(editedItem.tgl_masuk)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12 sm6 md12>
                  <v-menu ref="menu_tgl_keluar" :close-on-content-click="false" v-model="menu_tgl_keluar" :nudge-right="40" :return-value.sync="editedItem.tgl_keluar" lazy transition="scale-transition" offset-y full-width min-width="290px">
                    <v-text-field slot="activator" v-model="editedItem.tgl_keluar" label="Tanggal Keluar" prepend-icon="event" readonly></v-text-field>
                    <v-date-picker v-model="editedItem.tgl_keluar" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="menu_tgl_keluar = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.menu_tgl_keluar.save(editedItem.tgl_keluar)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
            <v-btn :loading="loading" v-if="this.editedIndex != -1" color="blue darken-1" flat @click.native="fsedit">Save</v-btn>
            <v-btn v-else color="blue darken-1" flat @click.native="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-data-table :headers="headers" :items="inventory" :search="search" select-all :pagination.sync="pagination" class="elevation-1" item-key="id" v-model="selected">
      <v-progress-linear slot="progress" color="blue"></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>
          <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
        </td>
        <td>{{ props.item.id }}</td>
        <td>{{ props.item.lab }}</td>
        <td>{{ props.item.kategori }}</td>
        <td>{{ props.item.nama }}</td>
        <td>{{ props.item.status }}</td>
        <td>{{ props.item.tgl_masuk }}</td>
        <td>{{ props.item.tgl_keluar }}</td>
        <td class="justify-center layout px-0">
          <v-icon small class="mr-2" @click="editItem(props.item)">
            edit
          </v-icon>
          <v-icon small @click="deleteItem(props.item); fsdelete(props.item.id)">
            delete
          </v-icon>
        </td>
      </template>
      <template slot="no-data">
        Tidak ada data.
      </template>
      <template slot="footer">
        <td colspan="100%">
          <v-btn color="error" v-if="selected.length >0">
            <v-icon>
              delete
            </v-icon>
          </v-btn>
          <!-- <span v-for="item in selected" :key="item.id">
            {{item}}
          </span> -->
          <v-flex xs12 sm12 md12 lg12 d-flex>
            <v-divider class="mx-3" inset vertical></v-divider>
            <v-select :items="dropdown_lab" label="LAB" v-model=sort_lab></v-select>
            <v-divider class="mx-3" inset vertical></v-divider>
            <v-select :items="dropdown_kategori" label="Kategori" v-model=sort_kategori></v-select>
            <v-divider class="mx-3" inset vertical></v-divider>
            <v-select :items="dropdown_status" label="Status" v-model=sort_status></v-select>
            <v-divider class="mx-3" inset vertical></v-divider>
          </v-flex>
        </td>
      </template>
      <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Hasil pencarian "{{ search }}" tidak dapat ditemukan.
      </v-alert>
    </v-data-table>
    <v-divider class="mx-3" inset></v-divider>
    <div class="text-xs-center pt-2">
      <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
    </div>
    <!-- <span v-for="item in selected" :key="item.id">
      {{item}}
    </span> -->
    <span>{{editedItem}}</span>
    <br>
    <span>{{editedIndex}}</span>
    <br>
    <span>{{sort_lab}}</span>
  </div>
</template>

<script>
import db from './firebaseInit'

export default {
  data: () => ({
    loading: false,
    menu_tgl_masuk: false,
    menu_tgl_keluar: false,
    dialog: false,
    selected: [],
    sort_lab: null,
    sort_kategori: null,
    sort_status: null,
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
    dropdown_status: ['Baik', 'Rusak', 'Out'],
    headers: [
      {
        text: 'ID Barang',
        value: 'id'
      },
      {
        text: 'LAB',
        value: 'lab'
      },
      {
        text: 'Kategori',
        value: 'kategori'
      },
      {
        text: 'Nama',
        value: 'nama'
      },
      {
        text: 'Status',
        value: 'status'
      },
      {
        text: 'Tanggal Masuk',
        value: 'tgl_masuk'
      },
      {
        text: 'Tanggal Keluar',
        value: 'tgl_keluar'
      },
      {
        text: 'Actions',
        value: 'id',
        sortable: false
      }
    ],
    inventory: [],
    editedIndex: -1,
    editedItem: {
      id: '',
      lab: '',
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
    },
    sort_lab(sort_lab) {
      switch (sort_lab) {
        case 'IFLAB 1':
          this.inventory = this.inventory.filter(data =>
            sort_lab.includes(data.lab)
          )
          break
        case 'IFLAB 2':
          this.inventory = this.inventory.filter(data =>
            sort_lab.includes(data.lab)
          )
          break
        case 'IFLAB 3':
          this.inventory = this.inventory.filter(data =>
            sort_lab.includes(data.lab)
          )
          break
        case 'IFLAB 4':
          this.inventory = this.inventory.filter(data =>
            sort_lab.includes(data.lab)
          )
          break

        case 'IFLAB 5':
          this.inventory = this.inventory.filter(data =>
            sort_lab.includes(data.lab)
          )
          break

        case 'ITLAB 1':
          this.inventory = this.inventory.filter(data =>
            sort_lab.includes(data.lab)
          )
          break

        case 'ITLAB 2':
          this.inventory = this.inventory.filter(data =>
            sort_lab.includes(data.lab)
          )
          break

        default:
          break
      }
    },
    sort_kategori(sort_kategori) {
      switch (sort_kategori) {
        case 'PC':
          this.inventory = this.inventory.filter(data =>
            sort_kategori.includes(data.kategori)
          )

          break
        case 'Monitor':
          this.inventory = this.inventory.filter(data =>
            sort_kategori.includes(data.kategori)
          )

          break

        case 'Peripherals':
          this.inventory = this.inventory.filter(data =>
            sort_kategori.includes(data.kategori)
          )

          break

        case 'Meja':
          this.inventory = this.inventory.filter(data =>
            sort_kategori.includes(data.kategori)
          )

          break

        default:
          break
      }
    },
    sort_status(sort_status) {
      switch (sort_status) {
        case 'Baik':
          this.inventory = this.inventory.filter(data =>
            sort_status.includes(data.status)
          )
          break

        case 'Rusak':
          this.inventory = this.inventory.filter(data =>
            sort_status.includes(data.status)
          )
          break

        case 'Out':
          this.inventory = this.inventory.filter(data =>
            sort_status.includes(data.status)
          )
          break

        default:
          break
      }
    }
  },
  created() {
    this.initialize()
  },
  methods: {
    fsdelete(id) {
      db
        .collection('inventory')
        .where('id', '==', id)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.delete()
          })
        })
    },
    initialize() {
      db
        .collection('inventory')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const data = {
              id: doc.data().id,
              lab: doc.data().lab,
              kategori: doc.data().kategori,
              nama: doc.data().nama,
              status: doc.data().status,
              tgl_masuk: doc.data().tgl_masuk,
              tgl_keluar: doc.data().tgl_keluar
            }
            this.inventory.push(data)
          })
        })
    },
    editItem(item) {
      this.editedIndex = this.inventory.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem(item) {
      const index = this.inventory.indexOf(item)
      confirm('Anda yakin?') && this.inventory.splice(index, 1)
    },
    deleteSelected(selected) {
      console.log(selected)
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
        db.collection('inventory').add({
          id: this.editedItem.id,
          lab: this.editedItem.lab,
          nama: this.editedItem.nama,
          kategori: this.editedItem.kategori,
          status: this.editedItem.status,
          tgl_masuk: this.editedItem.tgl_masuk,
          tgl_keluar: this.editedItem.tgl_keluar
        })
      }
      this.close()
    },
    fsedit() {
      this.loading = true
      db
        .collection('inventory')
        .where('id', '==', this.editedItem.id)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.set({
              id: this.editedItem.id,
              lab: this.editedItem.lab,
              nama: this.editedItem.nama,
              kategori: this.editedItem.kategori,
              status: this.editedItem.status,
              tgl_masuk: this.editedItem.tgl_masuk,
              tgl_keluar: this.editedItem.tgl_keluar
            })
          })
        })
      setTimeout(() => {
        this.close()
        this.loading = false
      }, 150)
      Object.assign(this.inventory[this.editedIndex], this.editedItem)
    }
  }
}
</script>
