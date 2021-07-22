//Validações de dados de entrada
//Essa função será acessada a partir de app.api.validation.(nome_da_função)
module.exports = app => {
    //Se o valor não existir, dará erro e apresentará uma mensagem
    //Vai verificar se os campos obrigatórios foram ou não informado
    function existsOrError(value, msg){
        if(!value) throw msg //mensagem de erro caso não seja validada a operação
        if(Array.isArray(value) && value.length === 0 ) throw msg //se o valor for um array e esse array for vazio. Ou seja, fiz uma consulta no BD e ele retornou um array vazio significa que ele não conseguiu obter a informação que desejada pelo usuário
        if(typeof value === 'string' && !value.trim()) throw msg //Se for uma string e essa string estiver vazia, ou seja, apenas com espaços em branco
    }
    
    //Se não existir não vai acontecer nada, mas se existir vai gerar um erro
    //consultar no banco de dados antes de cadastrar alguém para saber se aquele usuário não está contido no banco de dados
    function notExistsOrError(value, msg){
        try{
            existsOrError(value, msg)
        } catch(msg){ //Se cair no catch significa que não teve erro
            return
        }
        throw msg //Se der erro no "try", lança esse erro aqui
    }
    
    //Testar se dois valores são iguais ou não
    //Podem ter outras verificações como, por exemplo, verificar se o id e ou email são válidos ou não. Se a senha é válida ou não a partir das restrições e permissões definidas.
    //Nesse exemplo essa função será usada para comparar a senha e a confirmação de senha
    function equalsOrError(valueA, valueB, msg){
        if(valueA !== valueB) throw msg
    }

    return { existsOrError, notExistsOrError, equalsOrError }
}
