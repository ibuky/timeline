const js_timeline = {
  /**
   * init page
   * @param {*} x_page 
   */
  init: function(x_page) {
    this.setNow();
    this.loadTimeline();
    $('#submit').on('click', this.onClickSubmit.bind(this));
    $('#delete-all').on('click', this.onClickDeleteAll.bind(this));
  },

  /**
   * set current time in the input field.
   */
  setNow: function() {
    const date  = new Date();
    const now = date.getHours() + ':' + ('0' + '1').slice(-2);
    $('#time').val(now);
  },

  /**
   * load Timeline data from database
   */
  loadTimeline: function() {
    $('#timeline').empty();   // clear before selected timeline cards
    window.scrollTo(0,0);     // scroll to top
    $('#content').val('');    // clear content input field

    db.transaction((tx) => {
      const sql = "SELECT * FROM timeline WHERE valid = 't' ORDER BY time(time)";
      tx.executeSql(sql, [], (tx, result) => {
        const rows = result.rows;
        const div_timeline = document.getElementById('timeline');
        
        // when no data is registered
        if (rows.length <= 0) {
          const template_no_data = document.getElementById('temp-no-data');
          const clone = document.importNode(template_no_data.content, true);
          div_timeline.appendChild(clone);
          return;
        }

        const template = document.getElementById('temp-timeline');
        for (let i = 0; i < rows.length; i++) {
          const time    = rows.item(i).time;
          const content = rows.item(i).content;
          const card    = template.content;

          card.querySelector('.title').innerHTML    = time;
          card.querySelector('.content').innerHTML  = content;
          card.querySelector('ons-card').id         = rows.item(i).id;  // used when deleting
          
          const clone = document.importNode(card, true);
          div_timeline.appendChild(clone);
        }
      }, () => {
        console.log('database corrupted.');
        VtxUtil.showNoTitlePopup('broken database...');
      });
    });
  },

  /**
   * Action on clicking submit button
   */
  onClickSubmit: function() {
    $('#modal-loading').show();
    this.insertTimeline()
      .then(() => {
        $('#modal-loading').hide();
        this.loadTimeline();
      }).catch(() => {
        $('#modal-loading').hide();
        VtxUtil.showNoTitlePopup('Registration Failed...');
      });
  },

  /**
   * Insert input data to database
   */
  insertTimeline: function() {
    const time    = $('#time').val();
    const content = $('#content').val();
    if (time === '') {
      VtxUtil.showNoTitlePopup('Please set time.');
      $('#modal-loading').hide();
      return;
    }

    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        const sql =
          "INSERT INTO timeline (valid,time,content) "
        + "VALUES ('t',?,?)"

        tx.executeSql(sql, [time, content]);
      }, (error) => {
        console.log('databese insert failed: ' + error.messaage);
        reject();
      }, () => {
        console.log('databese insert success');
        resolve();
      });
    });
  },

  /**
   * Action on clicking DELETE ALL button
   */
  onClickDeleteAll: function() {
    ons.notification.confirm({
      message: 'Are you sure you want to delete all schedule?',
      callback: (idx) => {
        switch (idx) {
          case 1:
            this.deleteAllTimeline();
            break;
        }
      }
    });
  },

  /**
   * delete all data from database
   */
  deleteAllTimeline: function() {
    const sql = "DELETE FROM timeline"
    db.transaction((tx) => {
      tx.executeSql(sql);
    }, (error) => {
      console.log('delete failed: ' + error.messaage);
    }, () => {
      console.log('delete success');
      this.loadTimeline();
    });
  },

  /**
   * Action on clicking each card
   * @param {*} event 
   */
  onClickCard: function(event) {
    const card = event.target;
    const id   = card.id;
    const sql  = "DELETE FROM timeline WHERE id = ?";

    db.transaction((tx) => {
      tx.executeSql(sql, [id]);
    }, (error) => {
      console.log('delete failed:' + error.messaage);
    }, () => {
      console.log('delete success');
    });
  },
}