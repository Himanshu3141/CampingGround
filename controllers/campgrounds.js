const Campground=require('../models/campground');

module.exports.index=async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds, User: req.user }); 
  }


module.exports.rendernewform= (req, res) => {
    res.render('campgrounds/new',{User:req.user});
  }

module.exports.createCampground=(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author=req.user._id; 
    await campground.save();
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
  });

module.exports.showCampground=async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(campground);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground,User:req.user });
  };

  module.exports.rendereditform=async (req, res) => {
    const {id}=req.params;
    const campground = await Campground.findById(id);
    if(!campground){
      req.flash('error','Cannot find that campground!');
      return res.redirect('/campgrounds');
    }
     res.render('campgrounds/edit',{campground,User:req.user});
  };

  module.exports.updatecampground=async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  };

  module.exports.delete=async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
  };