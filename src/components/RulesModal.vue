<template>
  <div class="rules-modal" @click.self="$emit('close')">
    <div class="rules-container">
      <div class="rules-header">
        <h2>五人掼蛋规则说明</h2>
        <button class="close-button" @click="$emit('close')">×</button>
      </div>
      
      <div class="rules-content">
        <section class="rule-section">
          <h3>基本设置</h3>
          <ul>
            <li><strong>牌数：</strong>使用 3 副牌，去掉 2 张大王，保留 1 张大王</li>
            <li><strong>级牌：</strong>每局都打 2，百搭牌始终是红桃 2</li>
            <li><strong>出牌顺序：</strong>每局游戏由皇帝先出牌</li>
            <li><strong>摸牌顺序：</strong>第一局随机决定起始玩家，从第二局开始由上一局的皇帝先摸牌</li>
          </ul>
        </section>
        
        <section class="rule-section">
          <h3>身份确定</h3>
          <div class="identity-box">
            <div class="identity">
              <div class="identity-icon">👑</div>
              <div class="identity-desc">
                <strong>皇帝</strong> <span>抽到大王的玩家</span>
              </div>
            </div>
            <div class="identity">
              <div class="identity-icon">🃏</div>
              <div class="identity-desc">
                <strong>叫牌</strong> <span>皇帝从手牌中挑选两张相同的牌，同时展示给所有玩家</span>
              </div>
            </div>
            <div class="identity">
              <div class="identity-icon">🛡️</div>
              <div class="identity-desc">
                <strong>侍卫</strong> <span>持有另一张与叫牌相同牌的玩家（不能在出牌前展示）</span>
              </div>
            </div>
          </div>
          <div class="special-note">
            <strong>特殊情况：</strong>若未被展示的另一张叫牌，也在皇帝手中，则皇帝自己单独组队
          </div>
          <div class="identity-note">
            <strong>重要说明：</strong>侍卫在打出叫牌时，必须明确告知所有玩家这是叫牌
          </div>
        </section>
        
        <section class="rule-section">
          <h3>特殊牌力</h3>
          <ul>
            <li>大王价值相当于 6.5 炸（能压 6 个 A，但不能压 7 个 2）</li>
            <li>三个小王一起出，效力等同于一个大王</li>
            <li>未被展示的叫牌，在游戏过程中单独打出，这张牌可以压过任何除了大小王的单张牌</li>
          </ul>
        </section>
        
        <section class="rule-section">
          <h3>接风规则</h3>
          <p>当一名玩家打出最后一手牌且其他玩家都不要这手牌时，接风的人为后面第一个*可能*与这名玩家一伙的人。具体来说：</p>
          <ul>
            <li>如果走的是侍卫：接风的人是皇帝</li>
            <li>如果走的是皇帝：在侍卫明确前，接风的人是下一个玩家；在侍卫明确后，接风的人是侍卫</li>            
            <li>如果走的是农民：在侍卫明确前，接风的人是下一个非皇帝玩家；在侍卫明确后，接风的人是下一个农民</li>
          </ul>
        </section>
        
        <section class="rule-section">
          <h3>计分规则</h3>
          <h4>皇帝和侍卫是两人时:</h4>
          <table class="score-table">
            <thead>
              <tr>
                <th>排名组合</th>
                <th>皇帝/侍卫得分</th>
                <th>农民得分</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>头游+末游</td>
                <td>各<span class="positive-score">+30</span></td>
                <td>各<span class="negative-score">-20</span></td>
              </tr>
              <tr>
                <td>头游+三/四游</td>
                <td>各<span class="positive-score">+60</span></td>
                <td>各<span class="negative-score">-40</span></td>
              </tr>
              <tr>
                <td>头游+二游</td>
                <td>各<span class="positive-score">+90</span></td>
                <td>各<span class="negative-score">-60</span></td>
              </tr>
              <tr>
                <td>非头游+非末游</td>
                <td>各<span class="negative-score">-30</span></td>
                <td>各<span class="positive-score">+20</span></td>
              </tr>
              <tr>
                <td>二/三游+末游</td>
                <td>各<span class="negative-score">-60</span></td>
                <td>各<span class="positive-score">+40</span></td>
              </tr>
              <tr>
                <td>四游+末游</td>
                <td>各<span class="negative-score">-90</span></td>
                <td>各<span class="positive-score">+60</span></td>
              </tr>
            </tbody>
          </table>
          
          <h4>皇帝自己一伙时:</h4>
          <table class="score-table">
            <thead>
              <tr>
                <th>排名</th>
                <th>皇帝得分</th>
                <th>农民得分</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>头游</td>
                <td><span class="positive-score">+720</span></td>
                <td>各<span class="negative-score">-180</span></td>
              </tr>
              <tr>
                <td>非头游</td>
                <td><span class="negative-score">-360</span></td>
                <td>各<span class="positive-score">+90</span></td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
      
      <div class="rules-footer">
        <button class="close-btn" @click="$emit('close')">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RulesModal',
  emits: ['close']
}
</script>

<style scoped>
.rules-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--modal-overlay);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow-y: auto;
}

.rules-container {
  background-color: white;
  border-radius: 10px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.rules-header {
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.rules-header h2 {
  margin: 0;
  color: var(--text-color);
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 0 10px;
}

.rules-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.rule-section {
  margin-bottom: 24px;
}

.rule-section h3 {
  color: var(--primary-color);
  margin-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 8px;
}

.rule-section h4 {
  color: var(--text-color);
  margin: 16px 0 10px 0;
}

.rule-section ul, .rule-section ol {
  padding-left: 20px;
  margin-bottom: 10px;
}

.rule-section li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.identity-box {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.identity {
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 8px;
  min-width: 160px;
  flex: 1;
}

.identity-icon {
  font-size: 24px;
  margin-right: 12px;
}

.identity-desc {
  flex: 1;
}

.identity-desc strong {
  display: inline-block;
  margin-right: 5px;
}

.identity-desc span {
  font-size: 13px;
  color: #555;
}

.special-note {
  background-color: var(--emperor-color);
  border-left: 4px solid var(--warning-color);
  padding: 10px 15px;
  margin: 15px 0;
  border-radius: 4px;
}

.identity-note {
  background-color: #f0f7ff;
  border-left: 4px solid #1e88e5;
  padding: 10px 15px;
  margin: 15px 0;
  border-radius: 4px;
}

.score-table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
  font-size: 14px;
}

.score-table th, .score-table td {
  border: 1px solid var(--border-color);
  padding: 8px;
  text-align: center;
}

.positive-score {
  color: var(--positive-score-color);
  font-weight: bold;
}

.negative-score {
  color: var(--negative-score-color);
  font-weight: bold;
}

.score-table th {
  background-color: #f5f5f5;
}

.score-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.rules-footer {
  padding: 15px;
  border-top: 1px solid var(--border-color);
  text-align: center;
  background: white;
  position: sticky;
  bottom: 0;
}

.close-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

@media (max-width: 480px) {
  .rules-container {
    max-height: 95vh;
  }
  
  .identity-box {
    flex-direction: column;
  }
  
  .score-table {
    font-size: 12px;
  }
  
  .score-table th, .score-table td {
    padding: 6px 4px;
  }
  
  .rules-content {
    padding: 15px;
  }
}
</style>
