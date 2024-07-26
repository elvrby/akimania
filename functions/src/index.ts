import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const deleteExpiredWarranties = functions.pubsub
  .schedule("every 1 minute")
  .onRun(async (context) => {
    const now = new Date();
    try {
      const snapshot = await admin.firestore().collection("warranty")
        .where("expiration", "<=", now)
        .get();

      if (snapshot.empty) {
        console.log("No expired warranties to delete.");
        return;
      }

      const batch = admin.firestore().batch();
      snapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log("Expired warranties deleted successfully.");
    } catch (error) {
      console.error("Error deleting expired warranties", error);
    }
  });
