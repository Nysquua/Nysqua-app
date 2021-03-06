import React, { Component } from "react";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { IconContext } from "react-icons";
import StarRatings from 'react-star-ratings';
import { FiEdit2 } from 'react-icons/fi';
import SwipeableViews from 'react-swipeable-views';
import ProductCard from './../productCard';
import ExchangeDetails from './../ExchangeDetails';
import { Link } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Navbar from '../home/Navbar';
import ClothesAssistant from '../ClothesAssistant/ClothesAssistant';
import axios from 'axios';
import route from '../Route';
import './UserProfile.css';



class UserProfile extends Component {

    constructor(props) {
      super(props);
      this.state={
          index : 0,
          token:this.props.location.state.token,
          userData:this.props.location.state.userData,
          proposalsExchanges:[],
          offersExchanges: [],
          activeExchanges: [],
          garmentList: [],
          clothesAssistantDialogOpen: false,
          uploadedClothes: false,
          uploadedProposal: false,
          erasedGarment : false,
          cancelOrCompleteEx: false,
      };

      this.handleToEdit = this.handleToEdit.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.handleChangeIndex = this.handleChangeIndex.bind(this);
      this.handleDialogOpen = this.handleDialogOpen.bind(this);
      this.handleDialogClose = this.handleDialogClose.bind(this);
      this.callbackFunction = this.callbackFunction.bind(this);
      this.propExchanges = this.propProposalsExchanges.bind(this);
      this.proposalsIsEmpty = this.proposalsIsEmpty.bind(this);
      this.callbackFunctionExchange = this.callbackFunctionExchange.bind(this);
      this.renderGarmentList = this.renderGarmentList.bind(this);
      this.callbackFunctionErase = this.callbackFunctionErase.bind(this);


      this.gradient = 'linear-gradient(136deg, rgb(242, 113, 33) 0%, rgb(233, 64, 87) 50%, rgb(138, 35, 135) 100%)';
      this.StyledButton = withStyles({
        root: {
            backgroundImage: this.gradient,
            fontFamily: 'Product Sans !important',
            borderRadius: 3,
            border: 0,
            color: 'white',
            height: 48,
            padding: '0 30px',
            boxShadow: '0 3px 5px 2px rgba(255, 255, 255, .3)',
            margin: '1vh 0vw 1vh 0vh',
            fontSize: '1.05rem',
            transitionProperty: 'opacity',
            transitionDuration: '0.1s',

            '&:hover': {
                opacity: 0.9,
            },
            '&:active': {
                boxShadow: '0 3px 5px 2px rgba(255, 255, 255, .3)',
            },
        },
        label: {
            textTransform: 'capitalize',
        },
    })(Button);

    }

    proposalsIsEmpty(){
        return (this.state.proposalsExchanges.length == 0);
    }

    offersIsEmpty() {
        return (this.state.offersExchanges.length == 0);
    }

    activeIsEmpty() {
        return (this.state.activeExchanges.length == 0);
    }

    handleChange(event, value){
        console.log(this.state.index);

        this.setState({
            index: value,
        });
    }

    callbackFunctionErase(childData){
        this.setState({
            erasedGarment : childData,
        });

    }

    handleChangeIndex(index) {
        this.setState({
            index,
        });
    }

    handleToEdit(){
        this.LinkToEditElement.click();
    }

    handleDialogOpen(){
        this.setState({ clothesAssistantDialogOpen: true});
    }

    handleDialogClose(){
        this.setState({ clothesAssistantDialogOpen: false});
    }

    callbackFunction(childData){
        this.setState({
            userData: childData[0],
            uploadedClothes: childData[1]
        });
    }

    callbackFunctionExchange(childData) {
        this.setState({
            uploadedProposal: childData[0],
            cancelOrCompleteEx: childData[1],
        });
    }

    componentDidUpdate(){
        if (this.state.uploadedClothes){
            this.setState({uploadedClothes: false});
            this.handleDialogClose();
            this.componentDidMount();
        }

        if(this.state.uploadedProposal){
            console.log("Uploaded proposal");
            this.setState({uploadedProposal: false});
            this.componentDidMount();
        }

        if (this.state.cancelOrCompleteEx) {
            console.log("Cancel or finish exchange");
            this.setState({ cancelOrCompleteEx: false });
            this.componentDidMount();
        }
   /*      if(this.state.erasedGarment){

            console.log("Erased proposal");
            this.setState({erasedGarment: false});

            const config = {
                headers: {
                    'authorization': this.state.token,
                }
            };
            axios.get(route.url+'/users/me',config).then((response2)=>{
                        console.log(response2.data);
                        this.setState({userData : response2.data});
                        this.renderGarmentList();
                    }, (error) => {
                    console.log(error);
                });



        }    */
    }

    componentDidMount(){
        console.log(this.props.location.state);
        if(this.props.location.state.index != undefined){
            this.setState({index: this.props.location.state.index});

        }

        const config = {
            headers: {
                'authorization': this.state.token,
            }
        };
        axios.get(route.url+'/users/me',config).then((response2)=>{
                    console.log(response2.data);
                    this.setState({userData : response2.data});
                    this.renderGarmentList();

                    axios.post(route.url+'/exchange/proposals',{
                        userID: this.state.userData._id
                        },config).then((response)=>
                            {
                                console.log(response.data);
                                this.setState({proposalsExchanges: response.data});


                            }, (error) => {
                            console.log(error);
                        });

                    axios.post(route.url+'/exchange/offers', {
                        userID: this.state.userData._id
                        },config).then((response)=>
                            {
                                console.log(response.data);
                                this.setState({offersExchanges: response.data});

                            }, (error) => {
                            console.log(error);
                        });

                    axios.post(route.url+'/exchange/active', {
                        userID: this.state.userData._id
                        },config).then((response)=>
                            {
                                console.log(response.data);
                                this.setState({
                                    activeExchanges: response.data
                                });

                            }, (error) => {
                            console.log(error);
                        });

                }, (error) => {
                console.log(error);
            });
    }

    propProposalsExchanges(element){
        console.log(element);
        return(
            <ExchangeDetails
                token= {this.state.token}
                userData={this.state.userData}
                exchangeData={element}
                exchangeType={"other proposal"}
                parentCallback = {this.callbackFunctionExchange}/>
        );
    }

    propOffersExchanges(element){
        return(
            <ExchangeDetails
                token= {this.state.token}
                userData={this.state.userData}
                exchangeData={element}
                exchangeType={"my proposal"}
                parentCallback = {this.callbackFunctionExchange}/>
        );
    }

    propActiveExchanges(element){
        console.log(element);
        return(
            <ExchangeDetails
                token= {this.state.token}
                userData={this.state.userData}
                exchangeData={element}
                exchangeType={"exchange"}
                parentCallback = {this.callbackFunctionExchange}/>
        );
    }

    renderGarmentList() {
        var ctx = this;
        let maxSize = this.state.userData.garmentList.length;
        let garmentObjects = [];
        for(var i = 0; i < maxSize; i += 4){
            garmentObjects.push(

                    <Grid
                        container
                        spacing={4}
                        direction = "row"
                        justify = "center">
                        <Grid item xs={3}>
                            {(i < maxSize) ? <ProductCard token= {this.state.token}
                                                          productData={this.state.userData.garmentList[i]}
                                                          parentCallback = {this.callbackFunctionErase} /> : ""}
                        </Grid>
                        <Grid item xs={3}>
                            {(i + 1 < maxSize) ? <ProductCard token= {this.state.token}
                                                              productData={this.state.userData.garmentList[i+1]}
                                                              parentCallback = {this.callbackFunctionErase}/> : ""}
                        </Grid>
                        <Grid item xs={3}>
                            {(i + 2 < maxSize) ?<ProductCard token= {this.state.token}
                                                             productData={this.state.userData.garmentList[i+2]}
                                                             parentCallback = {this.callbackFunctionErase}/> : ""}
                        </Grid>
                        <Grid item xs={3}>
                            {(i + 3 < maxSize) ? <ProductCard token= {this.state.token}
                                                              productData={this.state.userData.garmentList[i+3]}
                                                              parentCallback = {this.callbackFunctionErase}/> : ""}
                        </Grid>
                    </Grid>

            );
        }

        this.setState({
            garmentList:garmentObjects
        })
    }


    render(){
        return(
            <div className = "profile_container">
                 <Navbar token = {this.state.token} userData ={this.state.userData} />
                 <div className = "userProfile">
                     <div className = "info_container">
                        <div className = "profilephoto">
                            <img  className ="adjust_photo"  src ={this.state.userData.profilePhoto} ></img>
                        </div>
                        <div className = "text_info">
                            <div className="user_name_container">
                                <p className="user_name_text">{this.state.userData.username}</p>
                                <div className="user_edit_btn_container" onClick={this.handleToEdit}>
                                    <div className="user_edit_btn">
                                        <IconContext.Provider value={{ size: "1em", className: 'user_edit_icon'}}>
                                            <FiEdit2 />
                                        </IconContext.Provider>
                                        <p className="user_edit_btn_label">Editar perfil</p>
                                    </div>
                                    <Link to={{
                                        pathname: '/UserEdit',
                                        state: {
                                            token: this.state.token,
                                            userData: this.state.userData
                                        }
                                        }}
                                        ref={
                                            LinkToEdit => this.LinkToEditElement = LinkToEdit
                                        }>
                                    </Link>
                                </div>
                            </div>
                            <p className="user_bio_text">{this.state.userData.biography}</p>
                            <Grid container
                                direction = "row"
                                justify = "center"
                                alignItems = "center"
                                wrap = "nowrap"
                                spacing={6}>

                                <Grid item xs={6}>
                                    <div className="user_rating_container_container">
                                        <div className="user_rating_container">
                                            <p>Confiabilidad</p>
                                            <StarRatings
                                            rating={this.state.userData.rating}
                                            starRatedColor="black"
                                            numberOfStars={5}
                                            name='rating'
                                            starDimension ="25px"/>
                                            <p className="user_rate_text">¡Súper confiable!</p>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={6}>
                                    <div className="swap_rating_container_container">
                                        <div className="swap_rating_container_margin">
                                            <div className="swap_rating_container">
                                                <p>Intercambios</p>
                                                <div className="swap_rating">
                                                    <div className="swap_rate_content">
                                                        <p className="number">{this.state.userData.totalExchanges}</p>
                                                        <p>Completados exitosamente</p>
                                                    </div>
                                                    <span className="swap_rating_divider"></span>
                                                    <div className="swap_rate_content">
                                                        <p className="number">{this.state.userData.exchangesCanceled}</p>
                                                        <p>Cancelados por el usuario</p>
                                                    </div>
                                                    <span className="swap_rating_divider"></span>
                                                    <div className="swap_rate_content">
                                                        <p className="number">{this.state.userData.exchangesCanceledByOthers}</p>
                                                        <p>Cancelados por otros usuarios</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                     </div>
                     <div className = "tabs_container">
                        <Tabs value={this.state.index} fullWidth onChange={this.handleChange} >
                            <Tab label="Guardarropa" />
                            <Tab label="Mis Catalogos" />
                            <Tab label="Mis Intercambios" />
                        </Tabs>
                        <SwipeableViews index={this.state.index} onChangeIndex={this.handleChangeIndex}>
                            <div className= "tab_garment">
                                <div className="add_clothes_btn_container">
                                    <button className="icon-btn add_clothes-btn" onClick={this.handleDialogOpen}>
                                        <div className="add_clothes-icon"></div>
                                        <div className="add_clothes_btn-txt">Nueva Prenda</div>
                                    </button>
                                </div>
                                <div className="wardrobe_container">
                                   {this.state.garmentList}
                                </div>
                            </div>
                            <div className= "tab_garment">Acá estarán los catálogos del usuario</div>
                            <div className= "tab_garment">
                                <h1 className="exchanges_heading">Intercambios activos</h1>
                                <div className="exchanges_heading_divider"> <span></span></div>
                                {
                                    this.activeIsEmpty() ?
                                        <p>No tienes intercambios activos actualmente</p> :
                                        <div>
                                            {this.state.activeExchanges.map(this.propActiveExchanges, this)}
                                        </div>
                                }
                                <h1 className="exchanges_heading">Solicitudes de intercambio para ti</h1>
                                <div className="exchanges_heading_divider"> <span></span></div>
                                {
                                    this.proposalsIsEmpty() ?
                                        <p>No tienes solicitudes de intercambio por el momento</p> :
                                        <div>
                                            {this.state.proposalsExchanges.map(this.propProposalsExchanges, this)}
                                        </div>
                                }
                                <h1 className="exchanges_heading">Solicitudes de intercambio realizadas por ti</h1>
                                <div className="exchanges_heading_divider"> <span></span></div>
                                {
                                    this.offersIsEmpty() ?
                                        <p>No tienes intercambios solicitados para mostrar</p> :
                                        <div>
                                            {this.state.offersExchanges.map(this.propOffersExchanges, this)}
                                        </div>
                                }
                            </div>
                        </SwipeableViews>
                        <Dialog onClose={this.handleDialogClose} aria-labelledby="customized-dialog-title" open={this.state.clothesAssistantDialogOpen} fullWidth={true}>
                            <DialogContent dividers>
                                <ClothesAssistant token = {this.state.token} userData ={this.state.userData} parentCallback = {this.callbackFunction}/>
                            </DialogContent>
                        </Dialog>
                     </div>
                 </div>
            </div>
        )
    }

}


export default UserProfile;
