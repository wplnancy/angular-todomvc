(function(angular) {
  'use strict';

  // 创建一个模块用于管理整个应用
  var app = angular.module('app', []);
  // 4 创建一个控制器用于和界面交互（暴露）数据
  app.controller('TodoController', ['$scope','$location','$window', function($scope,$location,$window)
  {

    // 5 完成控制器中对视图的数据暴露操作
 /*   $scope.todos = [
      { id: Math.random(), text: 'JavaScript', completed: false },
      { id: Math.random(), text: 'HTML', completed: false },
      { id: Math.random(), text: 'CSS', completed: true },
    ];*/
	  //实例化本地存储
	  var storage=$window.localStorage;
	  $scope.todos=storage['todos_list']?JSON.parse(storage['todos_list']):[];

    $scope.input = '';

    // 8 暴露行为   用对象的形式统一管理
    $scope.actions = {};
    $scope.actions.add = function() {
    	// 获取文本框中的值，加入数组中，由于数据列表是自动同步的
    	if(!$scope.input){
    		// 如果文本框没有输入
    		return false;
    	}
    	$scope.todos.push({ id: getId(), text: $scope.input, completed: false });
		//添加完后清空文本框
		$scope.input = '';
		$scope.actions.save();
		//注意嵌套的问题，括弧的深度不要太深
    };

	  //获取随机的id的值
	  function getId(){
		  var id=Math.random();
		  for(var i=0;i<$scope.todos.length;i++){
			  if($scope.todos[i].id===id){
				  id=getId();
				  break;
			  }
		  }
		  return id;//这是递归的出口
	  }




	  //处理删除操作
    $scope.actions.remove=function(id) {
		for (var i = 0; i < $scope.todos.length; i++) {
			if ($scope.todos[i].id === id) {
				$scope.todos.splice(i, 1);
				break;
			}
		}
		$scope.actions.save();

	};


	  //clear Completed的显示隐藏的判断
	  $scope.actions.exitCompleted=function(){
		  for (var i = 0; i < $scope.todos.length; i++) {
			  if ($scope.todos[i].completed === true) {
				 return true;
			  }
		  }
		  return false;
	  };




	  //全选和取消全选的实现
	  var now=true;
	  $scope.actions.toggleAll=function(){
		  for (var i = 0; i < $scope.todos.length; i++) {
             $scope.todos[i].completed=now;
		  }
		  now=!now;
		  $scope.actions.save();
	  };


	  //单个选项的切换处理
	  $scope.actions.toggle=function(){
		  //处理单选的情况  因为已经同步了，所以只需要直接保存就可以了
		  $scope.actions.save();

	  };

	  //双击编辑列表的功能
	  $scope.currentEditingId=-1;
	  // -1代表一个肯定不存在的元素，默认没有任何被编辑
	  $scope.actions.editing=function(id){
		  $scope.currentEditingId=id;
	  };

	  //按下回车键保存修改的结果
	  $scope.actions.submit=function(){
		  $scope.currentEditingId = -1;
		  $scope.actions.save();
	  };

	  //清空已完成
	  $scope.actions.clearCompleted=function(){
		  var result=[];
		  for (var i = 0; i < $scope.todos.length; i++) {
			  if(false==$scope.todos[i].completed){
				  result.push($scope.todos[i]);
			  }
		  }
		  $scope.todos=result;
		  $scope.actions.save();//保存结果
		  return $scope.todos;
	  };


	  //本地存储
	  $scope.actions.save=function(){
		  storage['todos_list']=JSON.stringify($scope.todos);
	  };

	  //勾选选择的列表选项
	  $scope.selector={};
	  //根据锚点值对selector的值做出修改
	  //var path=$location.path();
	  //watch方法只能监视属于$scope的已有的成员 通过下面的方法就可以啦
	  //让$scope也有一个指向$location的数据成员
	  $scope.$location=$location;
	  $scope.$watch('$location.path()',function(now,old){console.log(now);
	     console.log(old);
		  switch (now){
			  case '/active':
				  $scope.selector={completed:false};
				  break;
			  case '/completed':
				  $scope.selector={completed:true};
				  break;
			  default :
				  $scope.selector={};
				  break;
		  }
	  });

	  //注意filter是进行模糊匹配的 在这里比较应该是完全一致的才可以
	  //自定义函数  来比较两个值是否一样的
	  $scope.actions.equalCompare=function(source,target){
		/*  console.log(source);
		  console.log(target);*/
		  return source===target;//表示没有匹配上
	  }

  }]);


})(angular);
