// load db
db = null;

document.addEventListener('deviceready', function() {
  initDatabase();
});

// load each script
document.addEventListener('init', function(x_event) {
  const page = x_event.target;
  if (page.id === VtxConst.PAGE.TIMELINE) {
    js_timeline.init(page);
  }
});

function initDatabase() {
  db = window.sqlitePlugin.openDatabase({
    name:     'main.db',
    location: 'default',
  });

  const sql_create_table =
        "CREATE TABLE IF NOT EXISTS timeline ( "
      + "  id       INTEGER PRIMARY KEY,"
      + "  valid    TEXT    NOT NULL,"
      + "  time     TEXT    NOT NULL,"
      + "  content  TEXT,"
      + "  color    TEXT"
      + ")"
  
  // const sql_drop_table = "DROP TABLE IF EXISTS timeline"

  db.transaction((tx) => {
    tx.executeSql(sql_create_table);
  }, (error) => {
    console.log('databese initialization failed: ' + error.messaage);
  }, () => {
    console.log('databese initialization success');
  });
}