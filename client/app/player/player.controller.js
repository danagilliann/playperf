'use strict';

angular.module('musicApp')
  .controller('PlayerCtrl', function ($scope, $http, songza, soundcloud, angularPlayer) {
    $scope.stations = songza.stations;
    $scope.tracks = soundcloud.tracks;
    $scope.playable = [];
    $scope.link = songza.link;
    $scope.loaded = true;
    $scope.loading = false;
    $scope.paused = true;
    $scope.controlText = 'Pause';
    $scope.audio = null;
    $scope.current;
    $scope.played = 0;
    $scope.moving = 0;
    angularPlayer.init();
    $scope.termPlace = '_Enter Mood';
    $scope.isPlaying = angularPlayer.isPlayingStatus;


    $scope.songs = {
      id: 'one',
      title: 'songTitle',
      artist: 'ME',
      url: 'https://api.soundcloud.com/tracks/69837941/stream?client_id=c8cff8892431fa994f15e719dc19e6ef'
    };  

    $scope.send = function(){
      songza.searchStations($scope.term).success(function(){
        for(var i = 0; i < $scope.stations.length; i++){
          $scope.playable.push({type: 'songza', item: $scope.stations[i]});
        }
        songza.clearStations();
        $scope.stations = [];
      });
      soundcloud.searchTracks($scope.soundTerm).success(function(){
        for(var i = 0; i < $scope.tracks.length/4; i++){
          $scope.playable.push({type: 'cloud', item: $scope.tracks[i]});
        }
        soundcloud.clearTracks();
        $scope.tracks = [];
        $scope.getListen();
      });
    };

    $scope.getListen = function(){
      $scope.loading = true;
      if($scope.audio != null){
          $scope.audio.stop();
      }
      var choose =  Math.floor(Math.random() * $scope.playable.length);
      var item = $scope.playable[choose];
      $scope.playable.splice(choose, 1);
      $scope.current = item;
      $scope.source = item.type;
      if(item.type === 'songza'){
        $scope.songzaPlay(item.item);
      }
      else if(item.type === 'cloud'){
        $scope.soundCloudPlay(item.item);
      }
      if($scope.term){
     	 $scope.termPlace = $scope.term;
     }
      $scope.term = '';
    };

    $scope.finishLoading = function(){
      $scope.loaded = true;
      angularPlayer.addTrack({id: $scope.played.toString(), title: $scope.songTitle, artist: 'ME', url: $scope.link});
      angularPlayer.nextTrack();
      $scope.played += 1;
      $scope.loading = false;
      $scope.paused = false;
      angularPlayer.play();
      for(var i = 0; i < $scope.playable.length; i++){
      	console.log($scope.playable.item.name);
      }
      console.log(angularPlayer.adjustVolumeSlider());
    };

    $scope.$on('track:progress', function(event, data) {
    	$scope.moving = data;
		$scope.$apply();
		if(data >= 99.5) {
			$scope.getListen();
		}
	});

    $scope.songzaPlay = function(obj){
      $scope.current = obj.id;
      songza.getListen(obj.id).success(function(data){
        $scope.link = data.listen_url;
        $scope.songTitle = data.song.title;
        $scope.artist = data.song.artist.name;
        $scope.finishLoading();
      });
    };

    $scope.follow = function(){
    	if($scope.source === 'songza'){
    		songza.getSimilar($scope.current).success(function(data){
    		for(var i = 0; i<data.length; i++){
    			$scope.playable.push({type: 'songza', item: data[i]});
    		}
	    	});

	    	songza.getStation($scope.current).success(function(data){
	    		var terms = data.dasherized_name.split('-');
	    		for(var i = 0; i < terms.length; i++){
	    			soundcloud.searchTracks(terms[i]).success(function(info){
	    				for(var j = 0; j < info.length/4; j++){
	    					$scope.playable.push({type: 'cloud', item: info[i]});
	    				}
	    			})
	    		}
	    	});
    	}
    	else if($scope.source === 'cloud'){
    		soundcloud.getSpecific($scope.current).success(function(data){
    			console.log(data);
    			var terms = data[0].tag_list.split(' ');
    			for(var i = 0; i< terms.length; i++){
    				songza.searchStations(terms[i]).success(function(info){
    					for(var i = 0; i<info.length; i++){
			    			$scope.playable.push({type: 'songza', item: info[i]});
			    		}
    				});
    			}
    		});
    	}
    	
    };

    $scope.soundCloudPlay = function(obj){
      $scope.current = obj.id;
      $scope.link = obj.stream_url+'?client_id='+$scope.clientID();
      $scope.songTitle = obj.title;
      $scope.artist = obj.user.username;
      $scope.finishLoading();

    };

    $scope.clientID = function(){
      return 'c8cff8892431fa994f15e719dc19e6ef';
    };

    $scope.$watch('audio.remaining', function(){
      if($scope.audio.remaining <= 0){
        $scope.getListen();
      }
    });

    $scope.toggleAudio = function(){
      if(!$scope.paused){
        angularPlayer.pause();
      }
      else {
        angularPlayer.play();
      }
      $scope.paused = !$scope.paused;
    };
    
  });