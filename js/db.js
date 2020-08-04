const dbPromised = idb.open("football-app", 1, function(upgradeDb) {
    const clubsObjectStore = upgradeDb.createObjectStore("clubs", {keyPath: "id",autoIncrement:true});
  });

  export function getAll() {
    return new Promise(function(resolve, reject) {
      dbPromised
        .then(function(db) {
          const tx = db.transaction("clubs", "readonly");
          const store = tx.objectStore("clubs");
          return store.getAll();
        })
        .then(function(clubs) {
          resolve(clubs);
        });
    });
  }

  export const dbInsertClub = club => {
    return new Promise((resolve, reject) => {
      dbPromised.then(db => {
            const transaction = db.transaction("clubs", `readwrite`);
            console.log(transaction);
            transaction.objectStore("clubs").put(club);
            return transaction;
        }).then(transaction => {
            if (transaction.complete) {
                resolve(true)
            } else {
                reject(new Error(transaction.onerror))
            }
        })
    })
};

export const dbDeleteClub = clubId => {
  return new Promise((resolve, reject) => {
    dbPromised.then(db => {
          const transaction = db.transaction("clubs", `readwrite`);
          console.log(transaction);
          transaction.objectStore("clubs").delete(clubId.id);
          return transaction;
      }).then(transaction => {
          if (transaction.complete) {
              resolve(true)
          } else {
              reject(new Error(transaction.onerror))
          }
      })
  })
};