import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

console.log(import.meta.env.VITE_FIREBASE_DATABASE_URL);

//init firebase
const app = initializeApp(firebaseConfig); 

// init services
const db = getFirestore(app);
const projectAuth = getAuth(app);
const projectStorage = getStorage(app);

// timestamp
const timestamp = Timestamp; 

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (info) => {
    if (info.file.status === 'done') {
      console.log('File uploaded successfully:', info.file);
    } else if (info.file.status === 'error') {
      console.error('Error uploading file:', info.file.error);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const storageRef = projectStorage.ref()
    const fileRef = storageRef.child(file.name);

    try {
      await fileRef.put(file.originFileObj);
      setUploading(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploading(false);
    }
  };
}

export { db, projectAuth, projectStorage, timestamp, FileUploader } 