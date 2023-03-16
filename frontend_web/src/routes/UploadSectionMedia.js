import { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom'; 
import './routes.css';
import { storage } from "./firebase_config";
import { ref, uploadBytesResumable, getDownloadURL, listAll, list } from "firebase/storage";
import { v4 } from "uuid";
import axios from '../api/axios';
import { LinearProgress, Button, TextField, Box, InputLabel, MenuItem, FormControl, RadioGroup, Radio, FormControlLabel, FormLabel, DialogTitle, Dialog } from '@mui/material'
import LinearProgressWithLabel from '@mui/material/LinearProgress'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel'

function UploadSectionMedia() {
    const [ mediaUrl, setMediaUrl] = useState(null);
    const [ progresspercent, setProgresspercent] = useState(0);
    const [ mediaUrls, setMediaUrls ] = useState([]);
    const [ preview, setPreview ] = useState("");
    const [ file, setFile ] = useState(null);
    const [ title, setTitle ] = useState("");
    const [ newTitle, setNewTitle ] = useState("");
    const [ selectedTags, setSelectedTags ] = useState([]);
    const [ newSelectedTags, setNewSelectedTags ] = useState([]);
    const [ tags, setTags ] = useState([]);
    const [ newTags, setNewTags ] = useState([]);
    const [ selectedSlide, setSelectedSlide ] = useState('');
    const [ selectedIndex, setSelectedIndex ] = useState(0);
    const [ edit, setEdit ] = useState(false);
    const [ isVideo, setVideo ] = useState(false);
    const [ isImage, setImage ] = useState(true);


    const location = useLocation();
    const date = new Date();
    const storageRefList = ref(storage, `media_uploads/${location.state.section._id}`);


    const handleSubmit = () => {
      if (!file) return;
      const storageRef = ref(storage, `media_uploads/${location.state.section._id}/${file.name + v4()}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      const storeURL = async (url) => {
          try {
              await axios.post(`/section_maps/${location.state.section._id}/data`, JSON.stringify({
                  url_link: url,
                  title: title,
                  tags: selectedTags,
                }), {
                  headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${location.state.userToken.token}`
                  },
                  withCredentials: true
                });
          }
          catch (error) {
            console.log("Data was not able to be stored on Mongo");
            return;
          }
      }
  
      uploadTask.on("state_changed",
        (snapshot) => {
          const progress =
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgresspercent(progress);
          console.log("🚀 ~ file: UploadSectionMedia.js:71 ~ handleSubmit ~ progress:", progress);
        },
        (error) => {
          alert(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setMediaUrl(downloadURL);
            setMediaUrls((prev) => [...prev, downloadURL]);
            storeURL(downloadURL)
          });
        }
      );
    }

    const handleTags = (event) => {
      setSelectedTags(event.target.value);
    }

    const handleTagSubmit = (event) => {
      event.preventDefault();
      setTags(selectedTags);
      setSelectedTags([]);
    }

    const handleNewTags = (event) => {
      setNewSelectedTags(event.target.value);
    }

    const handleNewTagSubmit = (event) => {
      event.preventDefault();
      setNewTags(newSelectedTags);
      setNewSelectedTags([]);
    }

    const handlePreview = async (e) => {
      setFile(e.target.files[0])
      setPreview(URL.createObjectURL(e.target.files[0]));
    }

    const handleSlide = (index) => {
      setSelectedSlide(mediaUrls[index]);
      setSelectedIndex(index);
    }

    const handleEdit = () => {
      setEdit(true);
    }

    const handleSave = () => {
      setEdit(false);
      console.log(selectedIndex);
      const update = async () => {
        try {
            await axios.put(`/section_maps/${location.state.section._id}/data/${location.state.section.data[selectedIndex + 1]._id}`, JSON.stringify({
                title: newTitle,
                tags: newSelectedTags,
              }), {
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                  'Authorization': `Bearer ${location.state.userToken.token}`
                },
                withCredentials: true
              });
        }
        catch (error) {
          console.log("Data was not able to be updated on Mongo");
          return;
        }
      }
      update();
    }

    const handleMedia = (e) => {
      const temp = e.target.value;
      console.log(temp);
      
      if(temp == "Image")
      {
        setVideo(false);
        setImage(true);
        console.log(`Image: ${isImage}`);
        console.log(`Video: ${isVideo}`);
      }
        
      else if(temp == "Video")
      {
        setImage(false);
        setVideo(true);
        console.log(`Image: ${isImage}`);
        console.log(`Video: ${isVideo}`);
        
      }
    }

    const removeNewTag = (removedTag) => {
      const temp = newTags.filter((newTag) => newTag !== removedTag);
      setNewTags(temp);
    };

    const removeTag = (removedTag) => {
      const temp = tags.filter((tag) => tag !== removedTag);
      setTags(temp);
    };

    useEffect(() => {
      listAll(storageRefList).then((response) => {
        response.items.forEach((item) => {
          getDownloadURL(item).then((downloadURL) => {
            setMediaUrls((prev) => [...prev, downloadURL]);
          });
        });
      });
      }, []);

	const options = ["Sidewalk", "Transit Shelter", "Bus Lane", "Turn Lane", "Planter", "Drive Lane", "Bike Lane", "Parking Lane", "Street Lighting", "Stairs/Ramps", "Outdoor Seating Area", "Outdoor Restaurant Seating Area", "Canopy", "Building Structure", "Loggia", "Breezeway", "Drainage Field/Ditch", "Tree Canopy", "Lake/River Water", "Monument/Fountain", "Leisure Area"];


    return (
        <div className="UploadSectionMedia">
          <h1> Section Cutter </h1>
          <br/>
            {
              !preview ? 
                <div className="SubmitButton">
                  <input type='file' onChange={handlePreview} />
                  <br/>
                </div>
            :
              <div className="ImgPreview">
                <br/>
                {
                  isImage ?
                  <img style={{height: "20vh", width : "30vw"}} src={preview} /> : null
                }
                {
                  isVideo ?
                  <div>
                    <video width="320" height="240" controls>
                      <source src={preview} type="video/mp4"></source>
                      <source src={preview} type="video/ogg"></source>
                    </video>
                  </div> : null
                }
                
                <br/>
                <FormControl sx={{alignItems: "center"}}>
                  <FormLabel>Media Type</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    defaultValue="Image"
                    onClick={handleMedia}
                  >
                  <FormControlLabel value="Image" control={<Radio />} label="Image" />
                  <FormControlLabel value="Video" control={<Radio />} label="Video" />
                  </RadioGroup>
                </FormControl>
                <br/>
                <TextField label="Title"style={{width: "10vw", margin: "1vw"}} onChange={text => {setTitle(text.target.value)}} value={title}/>
                <Box sx={{ minWidth: 120 }} >
                  <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label"> Tags </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedTags}
                    label="Tags"
                    onChange={handleTags}
                    multiple
                    style={{minWidth: 120}}
                  >
                  {options.map((option, index) => (
                      <MenuItem value={option}>{option}</MenuItem>
                  ))}
                  </Select>
                  {/* <Button onClick={handleTagSubmit}>Accept Tags</Button> */}
                  </FormControl>
                  {/* <div className="tag-container">
                    {tags.map((tag, index) => {
                      return (
                        <div key={index} className="tag">
                          {tag} <span onClick={() => removeTag(tag)}>x</span>
                        </div>
                      );
                    })}
                  </div> */}
                  
                  <div style={{ alignItems: 'center', margin: '1vw'}}>
                    <Button onClick={handleSubmit}> Upload Media </Button>
                    <br/>
                    {progresspercent > 0 && progresspercent < 99.99? <LinearProgressWithLabel value={progresspercent}/> : null}
                    </div>
                </Box>
              </div>
            }
            <br></br>
            <div className="slide-container">
              <h3>Current Images</h3>
              <Carousel showArrows={true} showThumbs={false} useKeyboardArrows={true} onChange={handleSlide}>
                {mediaUrls.map((slideImage, index)=> (
                  <div key={index}>
                    <img src={slideImage} width="40vw"/>
                  </div>
                ))} 
              </Carousel>
            </div>
            <Button onClick={handleEdit}>Open Edit Info</Button>

                <Dialog open={edit} fullWidth maxWidth="md" PaperProps={{ style: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}} >
                <div className="Edit" style={{alignItems: 'center', justifyContent: 'center' }}>
                <DialogTitle>Edit Info</DialogTitle>
                <TextField label="New Title"style={{width: "10vw", margin: "1vw"}} value={newTitle} onChange={text => {setNewTitle(text.target.value)}}></TextField>
                <Box sx={{ minWidth: 120}}>
                  <FormControl fullWidth sx={{ flexDirection: 'row' }}>
                  <InputLabel id="demo-simple-select-label"> Tags </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={newSelectedTags}
                    label="Tags"
                    onChange={handleNewTags}
                    multiple
                    style={{minWidth: 120}}
                  >
                  {options.map((option, index) => (
                      <MenuItem value={option}>{option}</MenuItem>
                  ))}
                  </Select>
                  <Button onClick={handleNewTagSubmit}>Add Tag</Button>
                  </FormControl>
                  <div className="tag-container">
                    {newTags.map((newTag, index) => {
                      return (
                        <div key={index} className="tag">
                          {newTag} <span onClick={() => removeNewTag(newTag)}>x</span>
                        </div>
                      );
                    })}
                  </div>
                </Box>
                <br></br>
                <Button onClick={handleSave}>Save</Button>
                </div>
                </Dialog>
            <br></br>
            <Button className='continueButton' component={Link} size='lg' variant='filledTonal' color='success' to='../' 
              state={{...location.state}}>
              Accept and Continue
            </Button>
        </div>
    );
}

export default UploadSectionMedia;